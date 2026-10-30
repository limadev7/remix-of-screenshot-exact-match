import { useState } from "react";
import { Ticket, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { combinedOdd, potentialReturn } from "@/lib/slip";

export function BetSlip({ onClose }: { onClose?: () => void }) {
  const { slip, removeSel, clearSlip, stake, setStake, balance, placeBet, history } = useStore();
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const odd = combinedOdd(slip);
  const ret = potentialReturn(stake, slip);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between bg-navy px-4 py-3 text-navy-foreground">
        <span className="flex items-center gap-2 font-display text-lg font-bold uppercase italic">
          <Ticket className="h-5 w-5 text-primary" /> Cupom
          <span className="rounded bg-primary px-1.5 text-xs not-italic">{slip.length}</span>
        </span>
        {onClose && <button aria-label="Fechar cupom" onClick={onClose}><X className="h-5 w-5" /></button>}
      </div>

      <div className="p-4">
        {slip.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Clique em uma odd para adicionar uma seleção ao cupom.</p>
        ) : (
          <ul className="mb-4 space-y-2">
            {slip.map((s) => (
              <li key={s.matchId} className="fade-up flex items-start gap-2 rounded-md bg-muted p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.pickLabel}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                </div>
                <b className="text-sm text-primary">{s.odd.toFixed(2)}</b>
                <button aria-label="Remover seleção" onClick={() => removeSel(s.matchId)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor (créditos)</label>
        <input
          type="number" min={1} step={1} value={stake}
          onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
          className="mb-3 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <div className="mb-3 flex gap-2">
          {[5, 10, 25, 50].map((v) => (
            <button key={v} onClick={() => setStake(v)} className="flex-1 rounded border border-border py-1 text-xs hover:border-primary">{v}</button>
          ))}
        </div>

        <dl className="space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Odd combinada</dt><dd className="font-bold">{odd ? odd.toFixed(2) : "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Retorno teórico</dt><dd className="font-bold text-success">{ret.toFixed(2)}</dd></div>
          <div className="flex justify-between text-xs"><dt className="text-muted-foreground">Saldo</dt><dd>{balance == null ? "Entre para apostar" : balance.toFixed(2)}</dd></div>
        </dl>

        <div className="mt-4 flex gap-2">
          <button onClick={clearSlip} disabled={!slip.length} aria-label="Limpar cupom"
            className="flex items-center justify-center rounded-md border border-border px-3 disabled:opacity-40 hover:border-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            disabled={!slip.length || stake <= 0 || busy}
            onClick={async () => {
              if (balance != null && stake > balance) return setMsg({ ok: false, t: "Saldo insuficiente." });
              setBusy(true);
              const err = await placeBet();
              setBusy(false);
              setMsg(err ? { ok: false, t: err } : { ok: true, t: "Aposta registrada. Ela é resolvida sozinha quando os jogos terminam." });
            }}
            className="h-10 flex-1 rounded-md bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Apostar
          </button>
        </div>
        {msg && <p className={`mt-2 text-xs ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.t}</p>}


        {history.length > 0 && (
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer text-muted-foreground">Histórico de apostas ({history.length})</summary>
            <ul className="mt-2 space-y-1">
              {history.map((h) => (
                <li key={h.id} className="flex justify-between rounded bg-muted px-2 py-1">
                  <span>{h.selections.length} sel. · odd {h.odd.toFixed(2)} · {h.status === "won" ? "Ganhou" : h.status === "lost" ? "Perdeu" : "Pendente"}</span>
                  <span>{h.stake} → <b className={h.status === "lost" ? "text-destructive" : "text-success"}>{h.potential_return.toFixed(2)}</b></span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
