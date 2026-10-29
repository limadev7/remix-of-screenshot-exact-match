import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Layout, SectionTitle } from "@/components/site";
import { StatusBadge } from "@/components/match-card";
import { useStore } from "@/lib/store";
import { type Match, type Sport, type Status, SPORT_LABEL, STATUS_LABEL, formatDate } from "@/data/matches";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — 7MBET" },
      { name: "description", content: "Gerencie partidas, placares e odds." },
      { property: "og:title", content: "Painel administrativo — 7MBET" },
      { property: "og:description", content: "Edite partidas, placares e odds." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const blank = (): Match => ({
  id: `m${Date.now()}`, sport: "futebol", league: "", home: "", away: "",
  date: new Date().toISOString().slice(0, 11) + "20:00", status: "upcoming",
  scoreHome: 0, scoreAway: 0, minute: 0, odds: { home: 2, draw: 3, away: 2 },
});

const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-muted-foreground">{label}<div className="mt-1">{children}</div></label>;
}

function Admin() {
  const { matches, saveMatch, deleteMatch, resetMatches } = useStore();
  const [edit, setEdit] = useState<Match | null>(null);
  const set = <K extends keyof Match>(k: K, v: Match[K]) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  const setOdd = (k: "home" | "draw" | "away", v: string) =>
    setEdit((e) => (e ? { ...e, odds: { ...e.odds, [k]: v === "" ? null : Number(v) } } : e));

  return (
    <Layout>
      <SectionTitle action={
        <div className="flex gap-2">
          <button onClick={() => setEdit(blank())} className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Nova</button>
          <button onClick={() => confirm("Restaurar dados de exemplo?") && resetMatches()} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Restaurar</button>
        </div>
      }>Painel administrativo</SectionTitle>


      {edit && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (!edit.home || !edit.away) return; saveMatch(edit); setEdit(null); }}
          className="fade-up mb-6 grid gap-3 rounded-lg border border-primary/40 bg-card p-4 sm:grid-cols-2"
        >
          <Field label="Esporte">
            <select className={inp} value={edit.sport} onChange={(e) => { const s = e.target.value as Sport; set("sport", s); setOdd("draw", s === "futebol" ? "3" : ""); }}>
              {(Object.keys(SPORT_LABEL) as Sport[]).map((s) => <option key={s} value={s}>{SPORT_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Campeonato"><input required className={inp} value={edit.league} onChange={(e) => set("league", e.target.value)} /></Field>
          <Field label="Mandante"><input required className={inp} value={edit.home} onChange={(e) => set("home", e.target.value)} /></Field>
          <Field label="Visitante"><input required className={inp} value={edit.away} onChange={(e) => set("away", e.target.value)} /></Field>
          <Field label="Data e horário"><input type="datetime-local" className={inp} value={edit.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Status">
            <select className={inp} value={edit.status} onChange={(e) => set("status", e.target.value as Status)}>
              {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Placar casa"><input type="number" min={0} className={inp} value={edit.scoreHome} onChange={(e) => set("scoreHome", Number(e.target.value))} /></Field>
            <Field label="Placar fora"><input type="number" min={0} className={inp} value={edit.scoreAway} onChange={(e) => set("scoreAway", Number(e.target.value))} /></Field>
            <Field label="Minuto"><input type="number" min={0} className={inp} value={edit.minute} onChange={(e) => set("minute", Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Odd 1"><input type="number" step="0.01" min={1.01} className={inp} value={edit.odds.home} onChange={(e) => setOdd("home", e.target.value)} /></Field>
            <Field label="Odd X"><input type="number" step="0.01" min={1.01} disabled={edit.sport !== "futebol"} className={inp} value={edit.odds.draw ?? ""} onChange={(e) => setOdd("draw", e.target.value)} /></Field>
            <Field label="Odd 2"><input type="number" step="0.01" min={1.01} className={inp} value={edit.odds.away} onChange={(e) => setOdd("away", e.target.value)} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na página inicial</label>
          <div className="flex gap-2 sm:col-span-2">
            <button className="rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground">Salvar</button>
            <button type="button" onClick={() => setEdit(null)} className="rounded-md border border-border px-5 py-2">Cancelar</button>
          </div>
        </form>
      )}

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {matches.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{m.home} {m.status !== "upcoming" && `${m.scoreHome} - ${m.scoreAway}`} {m.away}</p>
              <p className="truncate text-xs text-muted-foreground">{SPORT_LABEL[m.sport]} · {m.league} · {formatDate(m.date)}</p>
            </div>
            <StatusBadge status={m.status} />
            <button aria-label="Editar" onClick={() => setEdit(m)} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
            <button aria-label="Excluir" onClick={() => deleteMatch(m.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
