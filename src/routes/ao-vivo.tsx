import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, SectionTitle } from "@/components/site";
import { OddButtons, TeamBadge } from "@/components/match-card";
import { useStore } from "@/lib/store";
import type { Match } from "@/data/matches";

export const Route = createFileRoute("/ao-vivo")({
  head: () => ({
    meta: [
      { title: "Ao Vivo — 7MBET" },
      { name: "description", content: "Partidas ao vivo com placar, cronômetro e estatísticas." },
      { property: "og:title", content: "Ao Vivo — 7MBET" },
      { property: "og:description", content: "Placar, cronômetro e estatísticas em tempo real." },
    ],
  }),
  component: AoVivo,
});

function stats(id: string) {
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pos = 40 + (seed % 21);
  return [
    { label: "Posse de bola (%)", h: pos, a: 100 - pos },
    { label: "Finalizações", h: 4 + (seed % 9), a: 3 + ((seed * 3) % 8) },
    { label: "Escanteios", h: seed % 7, a: (seed * 2) % 6 },
  ];
}

function LiveCard({ match, elapsed }: { match: Match; elapsed: number }) {
  const total = match.minute * 60 + elapsed;
  const mm = Math.min(Math.floor(total / 60), match.sport === "futebol" ? 90 : 120);
  const ss = String(total % 60).padStart(2, "0");
  return (
    <article className="fade-up overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between bg-navy px-4 py-2 text-xs text-navy-muted">
        <span className="truncate">{match.league}</span>
        <span className="flex items-center gap-1.5 font-bold text-live">
          <span className="live-dot h-2 w-2 rounded-full bg-live" /> AO VIVO · {mm}:{ss}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-4">
        <div className="flex flex-col items-center gap-2 text-center"><TeamBadge name={match.home} size="h-12 w-12" /><span className="text-sm font-semibold">{match.home}</span></div>
        <div className="font-display text-4xl font-extrabold text-navy">{match.scoreHome} <span className="text-muted-foreground">-</span> {match.scoreAway}</div>
        <div className="flex flex-col items-center gap-2 text-center"><TeamBadge name={match.away} size="h-12 w-12" /><span className="text-sm font-semibold">{match.away}</span></div>
      </div>
      <div className="space-y-2 px-4 pb-3">
        {stats(match.id).map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs"><b>{s.h}</b><span className="text-muted-foreground">{s.label}</span><b>{s.a}</b></div>
            <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="bg-primary" style={{ width: `${(s.h / (s.h + s.a || 1)) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4"><OddButtons match={match} /></div>
    </article>
  );
}

function AoVivo() {
  const { matches } = useStore();
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const live = matches.filter((m) => m.status === "live");
  return (
    <Layout>
      <SectionTitle>Ao vivo</SectionTitle>
      {live.length === 0 ? (
        <p className="rounded-lg bg-card p-8 text-center text-muted-foreground">Nenhuma partida ao vivo agora.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">{live.map((m) => <LiveCard key={m.id} match={m} elapsed={elapsed} />)}</div>
      )}
    </Layout>
  );
}
