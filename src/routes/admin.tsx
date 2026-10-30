import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, SectionTitle } from "@/components/site";
import { getMetrics, type Metrics } from "@/lib/bets.functions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Métricas — 7MBET" },
      { name: "description", content: "Números da plataforma: usuários, apostas e times mais apostados." },
      { property: "og:title", content: "Métricas — 7MBET" },
      { property: "og:description", content: "Usuários, apostas e times mais apostados no 7MBET." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { matches } = useStore();
  const [m, setM] = useState<Metrics | null>(null);
  useEffect(() => { getMetrics().then(setM).catch(() => {}); }, []);
  const card = (label: string, v: string | number) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold">{v}</p>
    </div>
  );
  return (
    <Layout>
      <SectionTitle>Métricas</SectionTitle>
      {!m ? <p className="text-sm text-muted-foreground">Carregando…</p> : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {card("Usuários apostando", m.users)}
            {card("Apostas", m.bets)}
            {card("Pendentes", m.pending)}
            {card("Ganhas / perdidas", `${m.won} / ${m.lost}`)}
            {card("Créditos apostados", Number(m.staked).toFixed(2))}
            {card("Créditos pagos", Number(m.paid).toFixed(2))}
            {card("Partidas reais no mês", matches.length)}
            {card("Ao vivo agora", matches.filter((x) => x.status === "live").length)}
          </div>
          <h3 className="mb-2 mt-6 font-display text-lg font-bold uppercase">Mais apostados</h3>
          {m.top.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma aposta ainda.</p> : (
            <ol className="space-y-1 text-sm">
              {m.top.map((t) => <li key={t.name} className="flex justify-between rounded bg-muted px-3 py-2"><span>{t.name}</span><b>{t.n}</b></li>)}
            </ol>
          )}
        </>
      )}
    </Layout>
  );
}
