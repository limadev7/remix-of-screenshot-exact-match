import type { Match } from "@/data/matches";
import type { Selection } from "@/lib/slip";

/** Resultado do cupom: perde se qualquer seleção errar; ganha só quando todas acertam e terminaram. */
export function settleOutcome(sels: Selection[], matches: Map<string, Match>): "won" | "lost" | "pending" {
  let allDone = true;
  for (const s of sels) {
    const m = matches.get(s.matchId);
    if (!m || m.status !== "finished") { allDone = false; continue; }
    const res = m.scoreHome > m.scoreAway ? "home" : m.scoreHome < m.scoreAway ? "away" : "draw";
    if (res !== s.pick) return "lost";
  }
  return allDone ? "won" : "pending";
}
