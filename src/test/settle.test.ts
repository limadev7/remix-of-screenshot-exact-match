import { describe, expect, it } from "vitest";
import { settleOutcome } from "@/lib/settle";
import type { Match } from "@/data/matches";

const mk = (id: string, status: Match["status"], h: number, a: number): Match => ({
  id, sport: "futebol", league: "L", home: "A", away: "B", date: "", status,
  scoreHome: h, scoreAway: a, minute: 0, odds: { home: 2, draw: 3, away: 2 },
});
const sel = (matchId: string, pick: "home" | "draw" | "away") => ({ matchId, pick, odd: 2, label: "", pickLabel: "" });

describe("settleOutcome", () => {
  it("ganha quando todas as seleções acertam e terminaram", () => {
    const m = new Map([["1", mk("1", "finished", 2, 0)], ["2", mk("2", "finished", 1, 1)]]);
    expect(settleOutcome([sel("1", "home"), sel("2", "draw")], m)).toBe("won");
  });
  it("perde assim que uma seleção erra, mesmo com outra pendente", () => {
    const m = new Map([["1", mk("1", "finished", 0, 1)], ["2", mk("2", "upcoming", 0, 0)]]);
    expect(settleOutcome([sel("1", "home"), sel("2", "home")], m)).toBe("lost");
  });
  it("fica pendente enquanto falta jogo terminar", () => {
    const m = new Map([["1", mk("1", "finished", 2, 0)], ["2", mk("2", "live", 0, 0)]]);
    expect(settleOutcome([sel("1", "home"), sel("2", "home")], m)).toBe("pending");
  });
});
