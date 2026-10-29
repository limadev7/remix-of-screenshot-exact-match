import { createFileRoute } from "@tanstack/react-router";
import { Layout, SectionTitle, SimNotice } from "@/components/site";
import { TeamBadge } from "@/components/match-card";
import { useStore } from "@/lib/store";
import { SPORT_LABEL } from "@/data/matches";

export const Route = createFileRoute("/resultados")({
  head: () => ({
    meta: [
      { title: "Resultados — 7MBET (simulação)" },
      { name: "description", content: "Histórico de partidas encerradas com placares finais demonstrativos." },
      { property: "og:title", content: "Resultados — 7MBET" },
      { property: "og:description", content: "Placares finais demonstrativos de partidas fictícias." },
    ],
  }),
  component: Resultados,
});

function Resultados() {
  const { matches } = useStore();
  const done = matches.filter((m) => m.status === "finished").sort((a, b) => b.date.localeCompare(a.date));
  const groups = done.reduce<Record<string, typeof done>>((acc, m) => {
    (acc[m.date.slice(0, 10)] ??= []).push(m);
    return acc;
  }, {});

  return (
    <Layout>
      <SectionTitle>Resultados</SectionTitle>
      <div className="mb-4"><SimNotice /></div>
      {done.length === 0 && <p className="rounded-lg bg-card p-8 text-center text-muted-foreground">Nenhum resultado ainda.</p>}
      {Object.entries(groups).map(([day, list]) => (
        <section key={day} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {new Date(day + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((m) => {
              const hWin = m.scoreHome > m.scoreAway, aWin = m.scoreAway > m.scoreHome;
              return (
                <article key={m.id} className="fade-up rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 flex justify-between text-xs text-muted-foreground">
                    <span>{m.league}</span><span>{SPORT_LABEL[m.sport]} · Encerrada</span>
                  </div>
                  {([[m.home, m.scoreHome, hWin], [m.away, m.scoreAway, aWin]] as const).map(([name, score, win]) => (
                    <div key={name} className="flex items-center gap-3 py-1">
                      <TeamBadge name={name} size="h-8 w-8" />
                      <span className={`flex-1 ${win ? "font-bold" : "text-muted-foreground"}`}>{name}</span>
                      <span className={`font-display text-2xl font-bold ${win ? "text-success" : "text-navy"}`}>{score}</span>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </Layout>
  );
}
