import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Trophy } from "lucide-react";
import { Layout, SectionTitle, SimNotice } from "@/components/site";
import { MatchCard, TeamBadge, StatusBadge } from "@/components/match-card";
import { useStore } from "@/lib/store";
import { POPULAR_LEAGUES, SPORT_LABEL, formatDate } from "@/data/matches";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "7MBET — A emoção do esporte começa aqui" },
      { name: "description", content: "Futebol, basquete e tênis: partidas, odds e resultados em um só lugar." },
      { property: "og:title", content: "7MBET — Plataforma esportiva" },
      { property: "og:description", content: "Partidas, odds e resultados de futebol, basquete e tênis." },
    ],
  }),
  component: Index,
});

function Index() {
  const { matches } = useStore();
  const featured = matches.filter((m) => m.featured && m.status !== "finished").slice(0, 4);
  const upcoming = matches.filter((m) => m.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  return (
    <Layout>

      <section className="mb-8">
        <SectionTitle action={<Link to="/ao-vivo" className="flex items-center text-sm font-semibold text-primary">Ao vivo <ChevronRight className="h-4 w-4" /></Link>}>
          Partidas em destaque
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">{featured.map((m) => <MatchCard key={m.id} match={m} />)}</div>
      </section>

      <section className="mb-8">
        <SectionTitle>Campeonatos populares</SectionTitle>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 xl:grid-cols-5">
          {POPULAR_LEAGUES.map((l) => (
            <Link key={l.name} to="/busca" search={{ q: l.name }}
              className="min-w-40 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary">
              <Trophy className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold leading-tight">{l.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{SPORT_LABEL[l.sport]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <SectionTitle>Próximos jogos</SectionTitle>
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {upcoming.map((m) => (
            <Link key={m.id} to={m.sport === "futebol" ? "/futebol" : m.sport === "basquete" ? "/basquete" : "/tenis"}
              className="flex items-center gap-3 p-3 hover:bg-muted">
              <div className="flex -space-x-2"><TeamBadge name={m.home} size="h-7 w-7" /><TeamBadge name={m.away} size="h-7 w-7" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{m.home} x {m.away}</p>
                <p className="truncate text-xs text-muted-foreground">{m.league}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{formatDate(m.date)}</p>
                <StatusBadge status={m.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SimNotice />
    </Layout>
  );
}
