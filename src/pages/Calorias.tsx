import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Camera, CheckCircle2, Loader2, Lock, Moon, Sun, Upload } from "lucide-react";

type Tier = "free_trial" | "limited" | "unlimited";

type UsageStatus = {
  tier: Tier;
  canAnalyze: boolean;
  remaining: number | null;
  trialUsed: number;
  limitedUsed: number;
  limitedLimit: number;
  limitedResetAt: string;
};

type AnalysisResult = {
  dishName: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

const storageUserIdKey = "vf-calorie-user-id";
const storageThemeKey = "vf-calorie-theme";
const WHATSAPP_NUMERO = "5511973008088";

const getWhatsappUrl = (mensagem: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(mensagem)}`;

const getOrCreateUserId = () => {
  const saved = localStorage.getItem(storageUserIdKey);
  if (saved) return saved;

  const generated = crypto.randomUUID();
  localStorage.setItem(storageUserIdKey, generated);
  return generated;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const tierLabel = (tier: Tier) => {
  if (tier === "limited") return "Plano Smart";
  if (tier === "unlimited") return "Plano Pro";
  return "Sem assinatura";
};

export default function CaloriasPage() {
  const [search] = useSearchParams();
  const plansRef = React.useRef<HTMLElement | null>(null);

  const [userId, setUserId] = React.useState("");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  const [usage, setUsage] = React.useState<UsageStatus | null>(null);
  const [loadingUsage, setLoadingUsage] = React.useState(true);

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);

  const [analyzing, setAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [error, setError] = React.useState("");
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = React.useState<"limited" | "unlimited" | "coaching" | null>(null);

  React.useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);

    const savedTheme = localStorage.getItem(storageThemeKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  React.useEffect(() => {
    if (!userId) return;

    const fetchUsage = async () => {
      setLoadingUsage(true);
      try {
        const res = await fetch(`/api/usage/status?userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Nao foi possivel carregar seu status de assinatura");
        setUsage(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao consultar status de assinatura");
      } finally {
        setLoadingUsage(false);
      }
    };

    void fetchUsage();
  }, [userId]);

  React.useEffect(() => {
    localStorage.setItem(storageThemeKey, theme);
  }, [theme]);

  React.useEffect(() => {
    const checkout = search.get("checkout");
    const plan = search.get("plan");
    const uid = search.get("uid") || userId;

    if (checkout !== "success" || plan !== "coaching" || !uid) return;

    const redirectKey = `vf-coaching-wa-${uid}`;
    if (sessionStorage.getItem(redirectKey)) return;

    sessionStorage.setItem(redirectKey, "1");
    const mensagem =
      `Oi! Ja paguei o Plano Acompanhamento (R$ 99,90).\n` +
      `Meu identificador: ${uid}.\n` +
      `Pode me enviar o formulario para iniciarmos?`;
    window.location.href = getWhatsappUrl(mensagem);
  }, [search, userId]);

  const checkoutStatus = search.get("checkout");
  const isDark = theme === "dark";

  const panelClass = isDark
    ? "border-zinc-800 bg-zinc-900/70 text-zinc-50"
    : "border-zinc-200 bg-white/80 text-zinc-900";

  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const accentClass = isDark
    ? "from-emerald-300 to-cyan-300 text-zinc-900"
    : "from-emerald-500 to-cyan-500 text-white";

  const isPaid = usage?.tier === "limited" || usage?.tier === "unlimited";

  const onFileSelected = (selected: File | null) => {
    if (!selected) return;
    setError("");
    setResult(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const onAnalyze = async () => {
    if (!file || !usage || !userId) return;

    if (!usage.canAnalyze) {
      setError("Sua assinatura esta inativa. Escolha um plano para liberar analises.");
      plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const imageBase64 = await fileToDataUrl(file);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageBase64 }),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.code === "PAYWALL_REQUIRED") {
          setUsage(json.usage);
          setError("Sua assinatura esta sem acesso para novas analises.");
          plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        throw new Error(json.error || "Erro ao analisar imagem");
      }

      setResult(json.analysis);
      setUsage(json.usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setAnalyzing(false);
    }
  };

  const onCheckout = async (plan: "limited" | "unlimited" | "coaching") => {
    if (!userId) return;

    setCheckoutLoadingPlan(plan);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao iniciar checkout");
      if (!json.url) throw new Error("Checkout sem URL");

      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no checkout");
      setCheckoutLoadingPlan(null);
    }
  };

  return (
    <div className={isDark ? "min-h-screen bg-zinc-950 text-zinc-50" : "min-h-screen bg-zinc-50 text-zinc-900"}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={
            isDark
              ? "absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"
              : "absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/40 blur-3xl"
          }
        />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        <header className={`rounded-3xl border px-4 py-5 md:px-6 ${panelClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={`text-xs uppercase tracking-[0.18em] ${mutedClass}`}>V&I Caloria IA</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Analise profissional de refeicoes por imagem</h1>
              <p className={`mt-2 text-sm ${mutedClass}`}>
                Fluxo 100% orientado a assinatura: envio da foto, processamento por IA e resultado nutricional em segundos.
              </p>
            </div>
            <button
              className={`inline-flex items-center justify-center rounded-full border p-2 transition ${panelClass}`}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full border px-3 py-1 ${panelClass}`}>
              {loadingUsage ? "Carregando assinatura..." : tierLabel(usage?.tier || "free_trial")}
            </span>
            {!loadingUsage && usage?.tier === "limited" && (
              <span className={`rounded-full border px-3 py-1 ${panelClass}`}>
                {usage.limitedUsed}/{usage.limitedLimit} analises no ciclo atual
              </span>
            )}
            {!loadingUsage && usage?.tier === "unlimited" && (
              <span className={`rounded-full border px-3 py-1 ${panelClass}`}>Analises ilimitadas ativas</span>
            )}
            {!loadingUsage && usage?.tier === "free_trial" && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-300">
                Acesso bloqueado ate ativar assinatura
              </span>
            )}
            <Link className={`rounded-full border px-3 py-1 transition hover:opacity-80 ${panelClass}`} to="/">
              Voltar ao inicio
            </Link>
          </div>
        </header>

        {checkoutStatus === "success" && (
          <section className={`rounded-2xl border px-4 py-3 text-sm ${panelClass}`}>
            Checkout confirmado. Sua assinatura sera validada e liberada automaticamente.
          </section>
        )}

        {checkoutStatus === "cancel" && (
          <section className={`rounded-2xl border px-4 py-3 text-sm ${panelClass}`}>
            Checkout cancelado. Voce pode retomar a assinatura a qualquer momento.
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { title: "1. Envio", desc: "Capture ou envie a foto da refeicao." },
            { title: "2. IA", desc: "A imagem e processada com analise nutricional." },
            { title: "3. Resultado", desc: "Receba calorias e macros de forma clara." },
          ].map((step) => (
            <article key={step.title} className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className="font-semibold">{step.title}</p>
              <p className={`mt-1 text-sm ${mutedClass}`}>{step.desc}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div
            className={`rounded-3xl border p-4 md:p-6 ${panelClass}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const selected = e.dataTransfer.files?.[0] || null;
              onFileSelected(selected);
            }}
          >
            <p className={`text-sm ${mutedClass}`}>Entrada de imagem</p>
            <h2 className="mt-1 text-xl font-semibold">Envie a foto do prato</h2>

            <label
              htmlFor="meal-file"
              className={`mt-4 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition ${
                dragActive ? "border-emerald-400 bg-emerald-400/10" : "border-zinc-500/40"
              }`}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-52 w-full rounded-xl object-cover" />
              ) : (
                <>
                  <Upload className="mb-3 h-8 w-8" />
                  <p className="font-medium">Arraste e solte aqui (desktop)</p>
                  <p className={`mt-1 text-sm ${mutedClass}`}>ou toque para escolher no celular</p>
                </>
              )}
            </label>

            <input
              id="meal-file"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
            />

            <button
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-3 font-semibold ${accentClass} disabled:opacity-50`}
              disabled={!file || analyzing || !isPaid}
              onClick={onAnalyze}
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processando imagem...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" /> Analisar refeicao
                </>
              )}
            </button>

            {!isPaid && (
              <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
                A analise fica liberada apenas com assinatura ativa.
              </div>
            )}
          </div>

          <div className={`rounded-3xl border p-4 md:p-6 ${panelClass}`}>
            <p className={`text-sm ${mutedClass}`}>Resultado da IA</p>
            <h2 className="mt-1 text-xl font-semibold">Relatorio nutricional</h2>

            {!result && !analyzing && (
              <div className={`mt-6 rounded-2xl border border-dashed p-6 text-center text-sm ${mutedClass}`}>
                Envie uma imagem para gerar o relatorio da refeicao.
              </div>
            )}

            {analyzing && (
              <div className="mt-6 space-y-3">
                <div className={`h-16 animate-pulse rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
                <div className={`h-16 animate-pulse rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
                <div className={`h-16 animate-pulse rounded-xl ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              </div>
            )}

            {result && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <article className={`rounded-2xl border p-4 sm:col-span-2 ${panelClass}`}>
                  <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Prato estimado</p>
                  <h3 className="mt-1 text-lg font-semibold">{result.dishName}</h3>
                </article>
                <article className={`rounded-2xl border p-4 ${panelClass}`}>
                  <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Kcal</p>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(result.kcal)}</p>
                </article>
                <article className={`rounded-2xl border p-4 ${panelClass}`}>
                  <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Proteina</p>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(result.protein)} g</p>
                </article>
                <article className={`rounded-2xl border p-4 ${panelClass}`}>
                  <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Carboidratos</p>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(result.carbs)} g</p>
                </article>
                <article className={`rounded-2xl border p-4 ${panelClass}`}>
                  <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Gorduras</p>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(result.fat)} g</p>
                </article>
              </div>
            )}
          </div>
        </section>

        <section ref={plansRef} className={`rounded-3xl border p-4 md:p-6 ${panelClass}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={`text-xs uppercase tracking-[0.18em] ${mutedClass}`}>Assinatura premium</p>
              <h2 className="mt-1 text-2xl font-semibold">Escolha seu plano</h2>
              <p className={`mt-1 text-sm ${mutedClass}`}>
                Pagamento recorrente com checkout seguro. O acesso e liberado automaticamente.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Checkout seguro
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Plano Smart</p>
              <p className="mt-2 text-3xl font-semibold">R$ 39,90</p>
              <p className={`text-sm ${mutedClass}`}>20 analises por mes</p>
              <ul className={`mt-3 space-y-1 text-sm ${mutedClass}`}>
                <li>- Resultado de calorias e macros</li>
                <li>- Acesso no ciclo mensal</li>
                <li>- Pagamento recorrente</li>
              </ul>
              <button
                className={`mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r px-4 py-3 font-semibold ${accentClass} disabled:opacity-50`}
                onClick={() => void onCheckout("limited")}
                disabled={checkoutLoadingPlan !== null}
              >
                {checkoutLoadingPlan === "limited" ? "Abrindo checkout..." : "Assinar"}
              </button>
            </article>

            <article className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Plano Pro</p>
              <p className="mt-2 text-3xl font-semibold">R$ 59,90</p>
              <p className={`text-sm ${mutedClass}`}>Analises ilimitadas</p>
              <ul className={`mt-3 space-y-1 text-sm ${mutedClass}`}>
                <li>- Uso sem limite de analises</li>
                <li>- Fluxo completo de IA nutricional</li>
                <li>- Pagamento recorrente</li>
              </ul>
              <button
                className={`mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r px-4 py-3 font-semibold ${accentClass} disabled:opacity-50`}
                onClick={() => void onCheckout("unlimited")}
                disabled={checkoutLoadingPlan !== null}
              >
                {checkoutLoadingPlan === "unlimited" ? "Abrindo checkout..." : "Assinar"}
              </button>
            </article>

            <article className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className={`text-xs uppercase tracking-widest ${mutedClass}`}>Plano Acompanhamento</p>
              <p className="mt-2 text-3xl font-semibold">R$ 99,90</p>
              <p className={`text-sm ${mutedClass}`}>Pagamento unico para acompanhamento alimentar profissional</p>
              <ul className={`mt-3 space-y-1 text-sm ${mutedClass}`}>
                <li>- Plano alimentar personalizado</li>
                <li>- Acompanhamento continuo</li>
                <li>- Pagamento unico</li>
              </ul>
              <button
                className={`mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r px-4 py-3 font-semibold ${accentClass} disabled:opacity-50`}
                onClick={() => void onCheckout("coaching")}
                disabled={checkoutLoadingPlan !== null}
              >
                {checkoutLoadingPlan === "coaching" ? "Abrindo checkout..." : "Assinar"}
              </button>
            </article>
          </div>

          {!isPaid && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
              <Lock className="h-4 w-4" /> Sem assinatura ativa, analise bloqueada.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
