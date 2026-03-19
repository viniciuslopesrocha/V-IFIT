import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, CreditCard, MessageCircle, QrCode, Star, Sparkles, Target, Heart, Calendar } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const WHATSAPP_NUMERO = "5511973008088";

const getWhatsappUrl = (mensagem: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(mensagem)}`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const plans = [
  {
    name: "Receitas Fit",
    badge: "GRÁTIS",
    price: "R$ 0",
    description: "Acesso gratuito à nossa curadoria de receitas fit para começar sua jornada saudável hoje mesmo.",
    features: ["9+ receitas exclusivas e selecionadas", "Filtro por categoria: café, almoço, jantar e mais", "Macros e calorias de cada receita", "Modo de preparo passo a passo", "Acesso imediato, sem cadastro"],
    highlight: false,
    free: true,
    whatsappText: "",
  },
  {
    name: "Plano Premium",
    badge: "MAIS POPULAR",
    price: "R$ 149,90",
    description: "Experiência premium com acompanhamento completo, personalizado e estratégico para seus resultados.",
    features: ["Plano 100% personalizado para o seu corpo e rotina", "Plano alimentar adaptado ao seu nível de atividade física (sem achismo)", "Alimentação que cabe no seu bolso — sem comidas caras ou difíceis", "Fácil de seguir no dia a dia (sem estratégia impossível)", "Ajustes estratégicos conforme sua evolução", "Lista de compras simples e prática", "Estratégia pensada para rotina corrida", "Acompanhamento próximo"],
    highlight: true,
    free: false,
    whatsappText: "Olá! Quero contratar o plano Premium da V&I Nutri Fit.",
  },
];


const testimonials = [
  {
    name: "Mariana Souza",
    result: "-8kg em 10 semanas",
    text: "A experiência foi impecável. O plano ficou totalmente alinhado à minha rotina e consegui manter consistência sem sofrer.",
  },
  {
    name: "Rafael Lima",
    result: "Mais definição e rotina organizada",
    text: "Visual profissional, atendimento excelente e um plano alimentar realmente personalizado. Fez muita diferença no meu dia a dia.",
  },
  {
    name: "Juliana Costa",
    result: "Constância sem estratégia improvável",
    text: "Finalmente encontrei algo elegante, simples de seguir e pensado para minha realidade. Recomendo muito.",
  },
];

const benefits = [
  { icon: Target, title: "Plano individual", desc: "Cada estratégia é ajustada para seu perfil e sua meta." },
  { icon: Sparkles, title: "Elegância e clareza", desc: "Processo profissional, bonito e fácil de entender." },
  { icon: Calendar, title: "Rotina real", desc: "Planejamento pensado para encaixar no seu dia a dia." },
  { icon: Heart, title: "Mais constância", desc: "Quanto mais viável, maior a chance de manter o resultado." },
];

export default function DietaPersonalizadaSite() {
  const [paginaObrigado, setPaginaObrigado] = React.useState(false);
  const [formData, setFormData] = React.useState({ nome: "", email: "", mensagem: "" });
  const [showPagamento, setShowPagamento] = React.useState(false);
  const [pixCopied, setPixCopied] = React.useState(false);
  const [showPedidoForm, setShowPedidoForm] = React.useState(false);
  const [pedidoData, setPedidoData] = React.useState({ nome: "", email: "", telefone: "", objetivo: "" });

  const handleClosePagamento = () => {
    setShowPagamento(false);
    setShowPedidoForm(false);
  };
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 1800);
    } catch {
      setPixCopied(false);
    }
  };
  const pixKey = "4c6b16f4-c4dc-4bfb-88e3-4dc8aaebda47";
  const mercadoPagoUrl = "https://mpago.li/1rvMnPR";

  const handlePedidoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPedidoData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePedidoPlanoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem =
      `Paguei pelo site!\n` +
      `Nome: ${pedidoData.nome}\n` +
      `Email: ${pedidoData.email}\n` +
      `Telefone: ${pedidoData.telefone}\n` +
      `Objetivo: ${pedidoData.objetivo}`;

    window.open(getWhatsappUrl(mensagem), "_blank", "noopener,noreferrer");
  };

  const PagamentoModal = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm" onClick={handleClosePagamento}>
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-gradient-card p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(var(--primary),0.18),transparent_48%)]" />
        <button
          onClick={handleClosePagamento}
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="relative z-10 mb-5 border-b border-border/60 pb-4 pr-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">Pagamento seguro</p>
          <h2 className="font-display text-3xl font-bold leading-tight text-foreground">Escolha a forma de pagamento</h2>
        </div>

        <div className="relative z-10 mb-4 rounded-2xl border border-border/70 bg-secondary/70 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <QrCode className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">PIX</h3>
          </div>
          <p className="mb-3 break-all rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">{pixKey}</p>
          <button
            onClick={handleCopyPix}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted"
          >
            <Copy className="h-4 w-4" /> Copiar chave PIX
          </button>
          <span className={`ml-3 text-xs font-medium ${pixCopied ? "text-primary" : "text-muted-foreground"}`}>
            {pixCopied ? "Chave copiada!" : "Copie e pague no app do seu banco"}
          </span>
        </div>

        <div className="relative z-10 rounded-2xl border border-border/70 bg-secondary/70 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CreditCard className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">Cartão</h3>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">Pagamento externo via Mercado Pago.</p>
          <a
            href={mercadoPagoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] hover:shadow-glow"
          >
            Pagar com cartão
          </a>
        </div>

        <button
          type="button"
          onClick={() => setShowPedidoForm((prev) => !prev)}
          className="relative z-10 mt-4 inline-flex w-full items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
        >
          Já peguei, pedir meu plano
        </button>

        {showPedidoForm && (
          <form onSubmit={handlePedidoPlanoSubmit} className="relative z-10 mt-4 rounded-2xl border border-primary/30 bg-background/70 p-4">
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
              <p className="mb-1 font-semibold text-primary text-[0.75rem]">Como funciona?</p>
              <p>① Preencha os dados abaixo e envie pelo WhatsApp.</p>
              <p>② Vou <span className="text-foreground font-medium">validar seu pagamento</span> manualmente.</p>
              <p>③ Após a validação, você receberá um <span className="text-foreground font-medium">formulário detalhado</span> com perguntas para montarmos seu plano alimentar 100% personalizado.</p>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary/80">Seus dados de contato</p>
            <div className="space-y-3">
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={pedidoData.nome}
                onChange={handlePedidoChange}
                required
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="email"
                name="email"
                placeholder="Seu melhor e-mail"
                value={pedidoData.email}
                onChange={handlePedidoChange}
                required
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone com DDD"
                value={pedidoData.telefone}
                onChange={handlePedidoChange}
                required
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                name="objetivo"
                placeholder="Qual seu principal objetivo com o plano?"
                value={pedidoData.objetivo}
                onChange={handlePedidoChange}
                rows={3}
                required
                className="w-full resize-none rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] hover:shadow-glow"
            >
              Enviar dados para WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mensagem = `Olá! Preciso de suporte da V&I Nutri Fit.\nNome: ${formData.nome}\nE-mail: ${formData.email}\nMensagem de suporte:\n${formData.mensagem}`;
    window.location.href = getWhatsappUrl(mensagem);
  };

  if (paginaObrigado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass max-w-md rounded-2xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-3 font-display text-2xl font-bold text-foreground">Pagamento recebido 🎉</h1>
          <p className="mb-6 text-muted-foreground">Agora envie o comprovante no WhatsApp para iniciarmos seu plano personalizado.</p>
          <a href={getWhatsappUrl("Olá! Realizei o pagamento via PIX e gostaria de enviar o comprovante.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-105">
            <MessageCircle className="h-4 w-4" /> Enviar comprovante
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      {showPagamento && PagamentoModal()}

      {/* Floating WhatsApp */}
      <a href={getWhatsappUrl("Olá! Preciso de suporte da V&I Nutri Fit.")} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow transition hover:scale-110">
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </a>

      {/* Nav */}
      <nav className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-bold tracking-wider text-foreground">V&I <span className="text-gradient-primary">NUTRI FIT</span></span>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#beneficios" className="transition hover:text-primary">Benefícios</a>
            <a href="#planos" className="transition hover:text-primary">Plano</a>
            <a href="#resultados" className="transition hover:text-primary">Resultados</a>
            <a href="#suporte" className="transition hover:text-primary">Suporte</a>
            <Link to="/receitas" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20">🥗 Receitas Fit</Link>
          </div>
          <a href="#planos" className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:scale-105">
            Começar agora
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24">
        <div className="bg-gradient-hero absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2 md:items-center md:gap-12 md:py-32">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span variants={fadeUp} className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wider text-primary">
              ESTRATÉGIA ALIMENTAR DE ALTO PADRÃO
            </motion.span>
            <motion.h1 variants={fadeUp} className="mb-6 font-display text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Pare de falhar em dietas.
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-8 max-w-lg text-base text-muted-foreground md:text-lg">
              Tenha um plano alimentar feito para sua rotina, simples, acessível e possível de seguir.
            </motion.p>
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2 md:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary" /> 10 vagas esta semana
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                Atendimento individual
              </span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 md:gap-4">
              <a href="#planos" className="rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105 hover:shadow-glow md:px-7 md:py-3.5 md:text-base">
                Começar agora
              </a>
              <a href={getWhatsappUrl("Olá! Preciso de suporte da V&I Nutri Fit.")} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-muted md:px-7 md:py-3.5 md:text-base">
                Falar com suporte
              </a>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative order-last">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-3xl" />
            <img src={heroFood} alt="Refeição saudável premium" className="relative rounded-2xl shadow-card w-full h-auto" />
            <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 glass rounded-xl p-2 md:p-4">
              <p className="text-lg md:text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Personalizado</p>
            </div>
            <div className="absolute -right-2 -top-2 md:-right-4 md:-top-4 glass rounded-xl p-2 md:p-4">
              <p className="text-lg md:text-2xl font-bold text-primary">Premium</p>
              <p className="text-xs text-muted-foreground">Visual profissional</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 text-center">
            <motion.h2 variants={fadeUp} className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Benefícios</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">Mais do que um plano. Uma experiência alimentar personalizada.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/30 hover:shadow-glow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 text-center">
            <motion.h2 variants={fadeUp} className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Escolha seu Plano</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">Comece grátis ou acelere seus resultados com o plano completo</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp} className={`relative flex flex-col rounded-2xl border p-8 transition ${plan.highlight ? "border-primary/40 bg-gradient-card shadow-glow" : "border-border bg-card"}`}>
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold tracking-wider ${
                    plan.highlight ? "bg-gradient-primary text-primary-foreground" : "border border-primary/30 bg-primary/10 text-primary"
                  }`}>
                    {plan.badge}
                  </span>
                )}
                <h3 className="mb-2 font-display text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mb-5 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mb-5">
                  {plan.highlight ? (
                    <>
                      <span className="mr-2 text-lg text-muted-foreground line-through">R$ 257,90</span>
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <p className="mt-1 text-xs text-muted-foreground">Via PIX ou cartão (até 6x)</p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <p className="mt-1 text-xs text-muted-foreground">Sem cartão, sem cadastro</p>
                    </>
                  )}
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                {plan.free ? (
                  <Link
                    to="/receitas"
                    className="block w-full rounded-full border border-primary/40 bg-primary/10 py-3 text-center text-sm font-semibold text-primary transition hover:scale-[1.02] hover:bg-primary/20"
                  >
                    Acessar receitas grátis
                  </Link>
                ) : (
                  <button
                    className="block w-full rounded-full bg-gradient-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
                    onClick={() => setShowPagamento(true)}
                  >
                    Contratar agora
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section id="resultados" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16 text-center">
            <motion.span variants={fadeUp} className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Transformações reais
            </motion.span>
            <motion.h2 variants={fadeUp} className="mb-3 font-display text-3xl font-bold text-foreground md:text-5xl">
              Quem confia, <span className="text-gradient-primary">transforma</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-muted-foreground">
              Planos entregues com consistência, estratégia e resultados que duram.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16 grid gap-px sm:grid-cols-3 overflow-hidden rounded-2xl border border-border bg-border">
            {[
              { value: "+120", label: "Planos entregues", sub: "clientes ativos e satisfeitos" },
              { value: "4.9", label: "Nota média", sub: "de 5 estrelas por clientes" },
              { value: "100%", label: "Personalizado", sub: "nenhum plano é igual ao outro" },
            ].map(({ value, label, sub }) => (
              <motion.div key={label} variants={fadeUp} className="flex flex-col items-center justify-center gap-1 bg-card px-6 py-10 text-center">
                <p className="text-4xl font-bold text-gradient-primary md:text-5xl">{value}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <motion.div
                key={item.name}
                variants={fadeUp}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-glow"
              >
                {/* Stars + rating */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-primary">5.0</span>
                </div>

                {/* Result badge */}
                <span className="mb-4 inline-block self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                  {item.result}
                </span>

                {/* Quote */}
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{item.text}”
                </p>

                {/* Divider */}
                <div className="mb-4 h-px bg-border" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                    {item.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cliente verificado</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Support */}
      <section id="suporte" className="border-t border-border px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">Suporte</motion.h2>
            <motion.p variants={fadeUp} className="mb-4 text-lg text-muted-foreground">Nosso time está pronto para te ajudar com pagamento, acesso e dúvidas do plano.</motion.p>
            <motion.p variants={fadeUp} className="mb-6 text-sm text-muted-foreground">Envie sua solicitação e receba atendimento de suporte no WhatsApp com prioridade.</motion.p>
            <motion.a variants={fadeUp} href={getWhatsappUrl("Olá! Preciso de suporte da V&I Nutri Fit.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary transition hover:underline">
              <MessageCircle className="h-4 w-4" /> Atendimento de suporte no WhatsApp
            </motion.a>
          </motion.div>
          <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} onSubmit={handleSubmit} className="space-y-4">
            <motion.input variants={fadeUp} type="text" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleChange} required className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <motion.input variants={fadeUp} type="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <motion.textarea variants={fadeUp} name="mensagem" placeholder="Descreva sua dúvida ou problema" value={formData.mensagem} onChange={handleChange} rows={4} required className="w-full resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <motion.p variants={fadeUp} className="text-xs text-muted-foreground">
              Ao enviar, o WhatsApp será aberto com sua solicitação de suporte preenchida.
            </motion.p>
            <motion.button variants={fadeUp} type="submit" className="w-full rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02] hover:shadow-glow">
              Enviar para suporte no WhatsApp
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 V&I NUTRI FIT — Plano alimentar personalizado com sofisticação, estratégia e resultado.</p>
        <p className="mt-3 text-xs text-muted-foreground/80">Este serviço não substitui acompanhamento médico ou nutricional profissional. As orientações fornecidas são baseadas em hábitos alimentares e estilo de vida.</p>
      </footer>
    </div>
  );
}
