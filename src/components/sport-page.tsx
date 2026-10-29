import { useMemo, useState } from "react";
import { type Sport, type Status, SPORT_LABEL, STATUS_LABEL } from "@/data/matches";
import { useStore } from "@/lib/store";
import { Layout, SectionTitle, SimNotice } from "@/components/site";
import { MatchCard } from "@/components/match-card";

const sel = "h-10 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary";

export function SportPage({ sport }: { sport: Sport }) {
  const { matches } = useStore();
  const all = matches.filter((m) => m.sport === sport);
  const leagues = [...new Set(all.map((m) => m.league))];
  const [league, setLeague] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Status | "">("");

  const list = useMemo(
    () => all
      .filter((m) => (!league || m.league === league) && (!status || m.status === status) && (!date || m.date.slice(0, 10) === date))
      .sort((a, b) => a.date.localeCompare(b.date)),
    [all, league, status, date],
  );

  return (
    <Layout>
      <SectionTitle>{SPORT_LABEL[sport]}</SectionTitle>
      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <select aria-label="Campeonato" className={sel} value={league} onChange={(e) => setLeague(e.target.value)}>
          <option value="">Todos os campeonatos</option>
          {leagues.map((l) => <option key={l}>{l}</option>)}
        </select>
        <input aria-label="Data" type="date" className={sel} value={date} onChange={(e) => setDate(e.target.value)} />
        <select aria-label="Status" className={sel} value={status} onChange={(e) => setStatus(e.target.value as Status | "")}>
          <option value="">Todos os status</option>
          {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <button className="h-10 rounded-md border border-border text-sm hover:border-primary" onClick={() => { setLeague(""); setDate(""); setStatus(""); }}>
          Limpar filtros
        </button>
      </div>
      <div className="mb-4"><SimNotice /></div>
      {list.length === 0 ? (
        <p className="rounded-lg bg-card p-8 text-center text-muted-foreground">Nenhuma partida encontrada com esses filtros.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">{list.map((m) => <MatchCard key={m.id} match={m} />)}</div>
      )}
    </Layout>
  );
}
