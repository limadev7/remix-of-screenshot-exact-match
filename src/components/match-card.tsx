import { TeamCrest, getCrest } from "@/components/team-crest";
import { type Match, STATUS_LABEL, formatDate } from "@/data/matches";
import { useStore } from "@/lib/store";
import type { Pick } from "@/lib/slip";



export function TeamBadge({ name, size = "h-9 w-9" }: { name: string; size?: string }) {
  return <TeamCrest name={name} size={size} />;
}

export function StatusBadge({ status }: { status: Match["status"] }) {
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 rounded bg-live/10 px-2 py-0.5 text-[11px] font-bold uppercase text-live">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" /> Ao vivo
      </span>
    );
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${status === "finished" ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OddButtons({ match }: { match: Match }) {
  const { slip, toggle } = useStore();
  const current = slip.find((s) => s.matchId === match.id)?.pick;
  const closed = match.status === "finished";
  const opts: { pick: Pick; label: string; odd: number | null; name: string }[] = [
    { pick: "home", label: "1", odd: match.odds.home, name: match.home },
    { pick: "draw", label: "X", odd: match.odds.draw, name: "Empate" },
    { pick: "away", label: "2", odd: match.odds.away, name: match.away },
  ];
  const visible = opts.filter((o) => o.odd !== null);
  return (
    <div className={`grid gap-2 ${visible.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {visible.map((o) => {
        const active = current === o.pick;
        return (
          <button
            key={o.pick}
            disabled={closed}
            onClick={() => toggle({ matchId: match.id, pick: o.pick, odd: o.odd!, label: `${match.home} x ${match.away}`, pickLabel: o.name })}
            className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
              active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted hover:border-primary"
            }`}
          >
            <span className={active ? "" : "text-muted-foreground"}>{o.label}</span>
            <b>{o.odd!.toFixed(2)}</b>
          </button>
        );
      })}
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const showScore = match.status !== "upcoming";
  return (
    <article className="fade-up rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate font-medium">{match.league}</span>
        <div className="flex shrink-0 items-center gap-2">
          {match.status === "live" ? <span className="font-semibold text-live">{match.minute}'</span> : <span>{formatDate(match.date)}</span>}
          <StatusBadge status={match.status} />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        {([["home", match.home, match.scoreHome], ["away", match.away, match.scoreAway]] as const).map(([k, name, score]) => (
          <div key={k} className="flex items-center gap-3">
            <TeamBadge name={name} />
            <span className="flex-1 truncate font-semibold text-card-foreground">{name} <span className="ml-1 text-[10px] font-bold tracking-wide text-muted-foreground">{getCrest(name).sigla}</span></span>
            {showScore && <span className="font-display text-xl font-bold text-navy">{score}</span>}
          </div>
        ))}
      </div>
      <OddButtons match={match} />
    </article>
  );
}
