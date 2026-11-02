import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, SectionTitle } from "@/components/site";
import { useStore } from "@/lib/store";
import { spin } from "@/lib/casino.functions";
import { SYMBOLS } from "@/lib/casino";

export const Route = createFileRoute("/cassino")({
  head: () => ({
    meta: [
      { title: "Cassino — 7MBET" },
      { name: "description", content: "Caça-níqueis Tigre da Sorte e Coelho da Sorte no 7MBET." },
      { property: "og:title", content: "Cassino 7MBET" },
      { property: "og:description", content: "Jogue Tigre da Sorte e Coelho da Sorte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cassino,
});

const GAMES = [
  { id: "tigre", name: "Tigre da Sorte", icon: "🐯" },
  { id: "coelho", name: "Coelho da Sorte", icon: "🐰" },
  { id: "rato", name: "Ratinho da Sorte", icon: "🐭" },
];

function Cassino() {
  const [game, setGame] = useState(GAMES[0]);
  return (
    <Layout>
      <SectionTitle>Cassino</SectionTitle>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setGame(g)}
            className={`rounded-lg border p-3 text-center transition-colors ${game.id === g.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary"}`}>
            <div className="text-3xl">{g.icon}</div>
            <p className="mt-1 text-xs font-semibold">{g.name}</p>
          </button>
        ))}
      </div>
      <Slot key={game.id} name={game.name} icon={game.icon} />
    </Layout>
  );
}

function Slot({ name, icon }: { name: string; icon: string }) {
  const { user, balance, refreshAccount } = useStore();
  const [stake, setStake] = useState(5);
  const [reels, setReels] = useState<string[]>([icon, icon, icon]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const play = async () => {
    setBusy(true); setMsg(null);
    const anim = setInterval(() => setReels([0, 1, 2].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])), 80);
    try {
      const [res] = await Promise.all([spin({ data: { stake } }), new Promise((r) => setTimeout(r, 1200))]);
      clearInterval(anim);
      setReels(res.reels.map((s) => (s === "🐯" ? icon : s)));
      setMsg(res.win ? `Você ganhou ${res.payout.toFixed(2)} créditos! (${res.mult}x)` : "Não foi dessa vez.");
      refreshAccount();
    } catch (e) {
      clearInterval(anim);
      setMsg(e instanceof Error ? e.message : "Erro");
    } finally { setBusy(false); }
  };

  return (
    <div className="rounded-xl bg-navy p-5 text-navy-foreground">
      <h2 className="mb-4 text-center text-2xl font-extrabold uppercase italic">{name}</h2>
      <div className="mx-auto mb-4 grid max-w-xs grid-cols-3 gap-2">
        {reels.map((s, i) => (
          <div key={i} className={`flex aspect-square items-center justify-center rounded-lg bg-card text-5xl ${busy ? "animate-pulse" : ""}`}>{s}</div>
        ))}
      </div>
      <p className="mb-3 min-h-6 text-center font-semibold text-primary">{msg}</p>
      {user ? (
        <div className="mx-auto flex max-w-xs flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span>Saldo: {balance == null ? "—" : balance.toFixed(2)}</span>
            <div className="flex gap-1">
              {[1, 5, 10, 50].map((v) => (
                <button key={v} onClick={() => setStake(v)}
                  className={`rounded px-2 py-1 text-xs font-semibold ${stake === v ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>{v}</button>
              ))}
            </div>
          </div>
          <button disabled={busy || (balance != null && balance < stake)} onClick={play}
            className="rounded-lg bg-primary py-3 text-lg font-extrabold uppercase text-primary-foreground disabled:opacity-50">
            {busy ? "Girando…" : `Girar (${stake})`}
          </button>
        </div>
      ) : (
        <Link to="/entrar" className="mx-auto block max-w-xs rounded-lg bg-primary py-3 text-center font-bold text-primary-foreground">Entre para jogar</Link>
      )}
    </div>
  );
}
