import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: ENV_PATH });

const APP_URL = process.env.APP_URL || "http://localhost:8080";
const API_PORT = Number(process.env.API_PORT || 8787);
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const LIMITED_LIMIT = 20;
const USERS_DB = path.join(__dirname, "data", "users.json");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
app.use(cors({ origin: true }));

const ensureDb = async () => {
  try {
    await fs.access(USERS_DB);
  } catch {
    await fs.mkdir(path.dirname(USERS_DB), { recursive: true });
    await fs.writeFile(USERS_DB, "{}", "utf8");
  }
};

const readUsers = async () => {
  await ensureDb();
  const raw = await fs.readFile(USERS_DB, "utf8");
  return raw.trim() ? JSON.parse(raw) : {};
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_DB, JSON.stringify(users, null, 2), "utf8");
};

const nextMonthlyResetIso = () => {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return d.toISOString();
};

const makeUser = (userId) => ({
  userId,
  tier: "free_trial",
  coachingActive: false,
  trialUsed: 0,
  limitedUsed: 0,
  limitedResetAt: nextMonthlyResetIso(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const getOrCreateUser = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  const users = await readUsers();
  if (!users[userId]) {
    users[userId] = makeUser(userId);
    await writeUsers(users);
  }

  return users[userId];
};

const patchUser = async (userId, patch) => {
  const users = await readUsers();
  const current = users[userId] || makeUser(userId);
  users[userId] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeUsers(users);
  return users[userId];
};

const normalizeUsageWindow = async (user) => {
  if (user.tier !== "limited") {
    return user;
  }

  if (!user.limitedResetAt || Date.now() >= new Date(user.limitedResetAt).getTime()) {
    return patchUser(user.userId, {
      limitedUsed: 0,
      limitedResetAt: nextMonthlyResetIso(),
    });
  }

  return user;
};

const usageStatus = (user) => {
  if (user.tier === "unlimited") {
    return {
      tier: user.tier,
      canAnalyze: true,
      remaining: null,
      trialUsed: user.trialUsed,
      limitedUsed: user.limitedUsed,
      limitedLimit: LIMITED_LIMIT,
      limitedResetAt: user.limitedResetAt,
    };
  }

  if (user.tier === "limited") {
    const remaining = Math.max(0, LIMITED_LIMIT - (user.limitedUsed || 0));
    return {
      tier: user.tier,
      canAnalyze: remaining > 0,
      remaining,
      trialUsed: user.trialUsed,
      limitedUsed: user.limitedUsed,
      limitedLimit: LIMITED_LIMIT,
      limitedResetAt: user.limitedResetAt,
    };
  }

  return {
    tier: "free_trial",
    canAnalyze: false,
    remaining: 0,
    trialUsed: user.trialUsed,
    limitedUsed: user.limitedUsed,
    limitedLimit: LIMITED_LIMIT,
    limitedResetAt: user.limitedResetAt,
  };
};

const incrementUsage = async (user) => {
  if (user.tier === "unlimited") {
    return user;
  }

  if (user.tier === "limited") {
    return patchUser(user.userId, {
      limitedUsed: (user.limitedUsed || 0) + 1,
    });
  }

  return patchUser(user.userId, {
    trialUsed: (user.trialUsed || 0) + 1,
  });
};

const PROMPT = `You are a nutrition vision analyzer. Analyze only visible food in the image.
Return ONLY valid JSON with this exact schema:
{
  "dishName": "string",
  "kcal": number,
  "protein": number,
  "carbs": number,
  "fat": number
}
Rules:
- Use numeric values for kcal/protein/carbs/fat.
- No markdown.
- No additional keys.
- If uncertain, provide your best estimate.`;

const analyzeWithOpenAI = async (imageBase64) => {
  if (!openai) {
    throw new Error("OpenAI API key is missing");
  }

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this meal image and return the JSON.",
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  const parsed = JSON.parse(content);
  return {
    dishName: String(parsed.dishName || "Prato estimado"),
    kcal: Number(parsed.kcal || 0),
    protein: Number(parsed.protein || 0),
    carbs: Number(parsed.carbs || 0),
    fat: Number(parsed.fat || 0),
  };
};

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe webhook is not configured" });
  }

  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && (plan === "limited" || plan === "unlimited" || plan === "coaching")) {
        const basePatch = {
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
          limitedResetAt: nextMonthlyResetIso(),
        };

        if (plan === "coaching") {
          await patchUser(userId, {
            ...basePatch,
            coachingActive: true,
          });
        } else {
          await patchUser(userId, {
            ...basePatch,
            tier: plan,
          });
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const users = await readUsers();
      const user = Object.values(users).find(
        (u) => u.stripeSubscriptionId && u.stripeSubscriptionId === subscription.id,
      );

      if (user) {
        const isCaloriePlan = user.tier === "limited" || user.tier === "unlimited";
        await patchUser(user.userId, isCaloriePlan ? { tier: "free_trial" } : { coachingActive: false });
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/usage/status", async (req, res) => {
  try {
    const userId = String(req.query.userId || "");
    let user = await getOrCreateUser(userId);
    user = await normalizeUsageWindow(user);
    return res.json(usageStatus(user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.post("/api/stripe/checkout", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    const { userId, plan } = req.body;
    if (!userId || (plan !== "limited" && plan !== "unlimited" && plan !== "coaching")) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const priceIdByPlan = {
      limited: process.env.STRIPE_PRICE_LIMITED,
      unlimited: process.env.STRIPE_PRICE_UNLIMITED,
      coaching: process.env.STRIPE_PRICE_COACHING,
    };

    const priceId = priceIdByPlan[plan];

    if (!priceId) {
      return res.status(500).json({ error: `Missing Stripe price id for plan ${plan}` });
    }

    await getOrCreateUser(userId);

    const returnParams = `plan=${encodeURIComponent(plan)}&uid=${encodeURIComponent(userId)}`;
    const checkoutMode = plan === "coaching" ? "payment" : "subscription";

    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/calorias?checkout=success&${returnParams}`,
      cancel_url: `${APP_URL}/calorias?checkout=cancel&${returnParams}`,
      metadata: {
        userId,
        plan,
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { userId, imageBase64 } = req.body;
    if (!userId || !imageBase64) {
      return res.status(400).json({ error: "Missing userId or imageBase64" });
    }

    let user = await getOrCreateUser(userId);
    user = await normalizeUsageWindow(user);

    const status = usageStatus(user);
    if (!status.canAnalyze) {
      return res.status(402).json({
        code: "PAYWALL_REQUIRED",
        message: "Plan required to continue",
        usage: status,
      });
    }

    const analysis = await analyzeWithOpenAI(imageBase64);
    user = await incrementUsage(user);

    return res.json({
      analysis,
      usage: usageStatus(user),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(API_PORT, () => {
    console.log(`API listening on http://localhost:${API_PORT}`);
  });
}

export default app;
