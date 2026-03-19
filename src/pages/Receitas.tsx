import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ChefHat, Flame, ArrowLeft, Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const categorias = ["Todas", "Café da Manhã", "Almoço", "Jantar", "Lanches", "Sobremesas"];

const receitas = [
  {
    id: 1,
    nome: "Omelete de Espinafre e Queijo Cottage",
    categoria: "Café da Manhã",
    calorias: 210,
    tempo: "10 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
    descricao: "Omelete rica em proteínas, leve e nutritiva para começar o dia com energia.",
    ingredientes: ["3 ovos", "1 punhado de espinafre", "2 col. sopa de queijo cottage", "Sal e pimenta a gosto", "Azeite de oliva"],
    preparo: "Bata os ovos, tempere, adicione o espinafre e o cottage. Cozinhe em frigideira antiaderente com azeite em fogo médio por 5 minutos.",
    proteinas: "22g",
    carbs: "3g",
    gorduras: "14g",
    nota: 4.9,
  },
  {
    id: 2,
    nome: "Bowl de Açaí Fit com Granola",
    categoria: "Café da Manhã",
    calorias: 280,
    tempo: "5 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80",
    descricao: "Bowl refrescante e poderoso, cheio de antioxidantes e energia para o dia.",
    ingredientes: ["200g de açaí sem adição de açúcar", "1/2 banana", "1 col. sopa de granola sem açúcar", "Frutas vermelhas", "Chia"],
    preparo: "Bata o açaí com a banana no liquidificador. Sirva com granola, frutas e chia por cima.",
    proteinas: "6g",
    carbs: "40g",
    gorduras: "10g",
    nota: 4.8,
  },
  {
    id: 3,
    nome: "Frango Grelhado com Legumes no Vapor",
    categoria: "Almoço",
    calorias: 350,
    tempo: "25 min",
    dificuldade: "Médio",
    imagem: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    descricao: "Prato completo, leve e saboroso para uma refeição equilibrada no almoço.",
    ingredientes: ["200g de peito de frango", "Brócolis", "Cenoura fatiada", "Abobrinha", "Alho, azeite e limão"],
    preparo: "Tempere o frango com alho, limão e azeite. Grelhe por 12 min. Cozinhe os legumes no vapor por 8 min. Sirva junto.",
    proteinas: "40g",
    carbs: "20g",
    gorduras: "8g",
    nota: 4.9,
  },
  {
    id: 4,
    nome: "Salmão Assado com Aspargos",
    categoria: "Jantar",
    calorias: 390,
    tempo: "30 min",
    dificuldade: "Médio",
    imagem: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    descricao: "Rico em ômega-3 e vitaminas, ideal para uma janta nutritiva e sofisticada.",
    ingredientes: ["180g de filé de salmão", "1 maço de aspargos", "Limão siciliano", "Azeite extravirgem", "Ervas finas e alho"],
    preparo: "Tempere o salmão com limão, ervas e azeite. Asse a 200°C por 18 min. No mesmo tabuleiro, coloque os aspargos.",
    proteinas: "38g",
    carbs: "6g",
    gorduras: "22g",
    nota: 5.0,
  },
  {
    id: 5,
    nome: "Wrap de Atum com Abacate",
    categoria: "Lanches",
    calorias: 260,
    tempo: "8 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80",
    descricao: "Lanche prático, cheio de proteínas e gorduras boas para saciar entre as refeições.",
    ingredientes: ["1 wrap integral", "1 lata de atum ao natural", "1/2 abacate amassado", "Alface americana", "Limão e sal"],
    preparo: "Amasse o abacate com limão e sal. Espalhe no wrap, adicione atum e alface. Enrole e sirva.",
    proteinas: "26g",
    carbs: "22g",
    gorduras: "14g",
    nota: 4.7,
  },
  {
    id: 6,
    nome: "Panqueca de Banana com Aveia",
    categoria: "Café da Manhã",
    calorias: 190,
    tempo: "12 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&q=80",
    descricao: "Panqueca sem glúten, sem açúcar e cheia de fibras. Perfeita para um café fit.",
    ingredientes: ["1 banana madura", "2 ovos", "4 col. sopa de aveia", "Canela a gosto", "Pasta de amendoim para servir"],
    preparo: "Amasse a banana, misture os ovos, a aveia e a canela. Frite em frigideira antiaderente em fogo baixo por 3 min cada lado.",
    proteinas: "10g",
    carbs: "28g",
    gorduras: "7g",
    nota: 4.8,
  },
  {
    id: 7,
    nome: "Salada Niçoise Fit",
    categoria: "Almoço",
    calorias: 310,
    tempo: "15 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    descricao: "Salada completa, colorida e rica em nutrientes, inspirada na culinária francesa.",
    ingredientes: ["Mix de folhas", "2 ovos cozidos", "1 lata de atum", "Tomate-cereja", "Vagem cozida", "Azeite e limão"],
    preparo: "Monte a salada com as folhas na base. Adicione ovos fatiados, atum, tomate e vagem. Regue com azeite e limão.",
    proteinas: "28g",
    carbs: "14g",
    gorduras: "16g",
    nota: 4.7,
  },
  {
    id: 8,
    nome: "Mousse de Chocolate Proteico",
    categoria: "Sobremesas",
    calorias: 160,
    tempo: "10 min",
    dificuldade: "Fácil",
    imagem: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600&q=80",
    descricao: "Sobremesa indulgente sem culpa. Cremosa, proteica e com sabor intenso de chocolate.",
    ingredientes: ["200g de tofu sedoso", "2 col. sopa de cacau 100%", "1 col. sopa de mel", "1 scoop de whey chocolate", "Extrato de baunilha"],
    preparo: "Bata todos os ingredientes no liquidificador até ficar cremoso. Leve à geladeira por 30 min antes de servir.",
    proteinas: "18g",
    carbs: "14g",
    gorduras: "5g",
    nota: 4.6,
  },
  {
    id: 9,
    nome: "Arroz de Couve-flor com Camarão",
    categoria: "Jantar",
    calorias: 270,
    tempo: "20 min",
    dificuldade: "Médio",
    imagem: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    descricao: "Substituto low carb do arroz tradicional, saboroso e rico em proteínas.",
    ingredientes: ["1/2 couve-flor ralada", "200g de camarão limpo", "Alho e cebola", "Azeite", "Salsinha e limão"],
    preparo: "Refogue alho e cebola, adicione a couve-flor ralada. Tempere e refogue por 5 min. Adicione o camarão e finalize com salsinha.",
    proteinas: "32g",
    carbs: "10g",
    gorduras: "9g",
    nota: 4.8,
  },
];

export default function Receitas() {
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("Todas");
  const [receitaSelecionada, setReceitaSelecionada] = React.useState<typeof receitas[0] | null>(null);

  const receitasFiltradas = categoriaAtiva === "Todas"
    ? receitas
    : receitas.filter((r) => r.categoria === categoriaAtiva);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <nav className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <span className="font-display text-lg font-bold tracking-wider text-foreground">
            V&I <span className="text-gradient-primary">NUTRI FIT</span>
          </span>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Receitas Fit</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24">
        <div className="bg-gradient-hero absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wider text-primary"
            >
              CURADORIA EXCLUSIVA V&I NUTRI FIT
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mb-4 font-display text-4xl font-bold leading-tight text-foreground md:text-6xl"
            >
              Receitas <span className="text-gradient-primary">Fit</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mb-8 max-w-xl text-base text-muted-foreground md:text-lg"
            >
              Receitas saudáveis, saborosas e pensadas para encaixar na sua rotina. Simples de fazer, ricas em nutrientes.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <ChefHat className="h-3 w-3" /> {receitas.length} receitas exclusivas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <Flame className="h-3 w-3" /> Focadas em resultado
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Rápidas e práticas
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
      <section className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-wrap justify-center gap-2"
          >
            {categorias.map((cat) => (
              <motion.button
                key={cat}
                variants={fadeUp}
                onClick={() => setCategoriaAtiva(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-[1.04] ${
                  categoriaAtiva === cat
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border border-border bg-secondary text-muted-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid de Receitas */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            key={categoriaAtiva}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {receitasFiltradas.map((receita) => (
              <motion.div
                key={receita.id}
                variants={fadeUp}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/30 hover:shadow-glow"
                onClick={() => setReceitaSelecionada(receita)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={receita.imagem}
                    alt={receita.nome}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                    {receita.categoria}
                  </span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-xs font-bold text-white">{receita.nota}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-2 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition">
                    {receita.nome}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{receita.descricao}</p>

                  <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {receita.tempo}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" /> {receita.calorias} kcal
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ChefHat className="h-3.5 w-3.5" /> {receita.dificuldade}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal detalhe da receita */}
      {receitaSelecionada !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm"
          onClick={() => setReceitaSelecionada(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/20 bg-gradient-card shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={receitaSelecionada.imagem}
                alt={receitaSelecionada.nome}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setReceitaSelecionada(null)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-sm transition hover:bg-black/60"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="mb-1 inline-block rounded-full bg-primary/80 px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {receitaSelecionada.categoria}
                </span>
                <h2 className="font-display text-2xl font-bold leading-tight text-white">
                  {receitaSelecionada.nome}
                </h2>
              </div>
            </div>

            <div className="p-6">
              {/* Macros */}
              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Proteínas", valor: receitaSelecionada.proteinas },
                  { label: "Carboidratos", valor: receitaSelecionada.carbs },
                  { label: "Gorduras", valor: receitaSelecionada.gorduras },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-secondary/70 p-3 text-center">
                    <p className="text-lg font-bold text-primary">{m.valor}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {receitaSelecionada.tempo}</span>
                <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {receitaSelecionada.calorias} kcal</span>
                <span className="inline-flex items-center gap-1"><ChefHat className="h-3.5 w-3.5" /> {receitaSelecionada.dificuldade}</span>
                <span className="ml-auto inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {receitaSelecionada.nota}</span>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{receitaSelecionada.descricao}</p>

              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary/80">Ingredientes</h4>
              <ul className="mb-5 space-y-1">
                {receitaSelecionada.ingredientes.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary/80">Modo de Preparo</h4>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{receitaSelecionada.preparo}</p>

              <button
                onClick={() => setReceitaSelecionada(null)}
                className="w-full rounded-full border border-border bg-secondary py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Fechar receita
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 V&I NUTRI FIT — Receitas criadas para transformar hábitos com leveza e prazer.</p>
      </footer>
    </div>
  );
}
