import { createFileRoute } from "@tanstack/react-router";
import { Layout, SectionTitle } from "@/components/site";
import { MatchCard } from "@/components/match-card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/busca")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Buscar — 7MBET (simulação)" },
      { name: "description", content: "Encontre times e campeonatos fictícios na 7MBET." },
      { property: "og:title", content: "Buscar — 7MBET" },
      { property: "og:description", content: "Pesquisa de times e campeonatos fictícios." },
    ],
  }),
  component: Busca,
});

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Busca() {
  const { q } = Route.useSearch();
  const { matches } = useStore();
  const term = norm(q);
  const list = term ? matches.filter((m) => norm(`${m.home} ${m.away} ${m.league}`).includes(term)) : [];
  return (
    <Layout>
      <SectionTitle>Busca</SectionTitle>
      <p className="mb-4 text-sm text-muted-foreground">
        {q ? <>{list.length} resultado(s) para “<b className="text-foreground">{q}</b>”</> : "Digite um time ou campeonato na barra de busca."}
      </p>
      {q && list.length === 0 && <p className="rounded-lg bg-card p-8 text-center text-muted-foreground">Nada encontrado. Tente “Aurora” ou “Copa”.</p>}
      <div className="grid gap-3 md:grid-cols-2">{list.map((m) => <MatchCard key={m.id} match={m} />)}</div>
    </Layout>
  );
}
