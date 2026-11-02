import { describe, it, expect } from "vitest";
import { spinOutcome } from "@/lib/casino";

describe("cassino", () => {
  it("ganha abaixo de 12%", () => expect(spinOutcome(0.119, 0.1, 0.1).win).toBe(true));
  it("perde a partir de 12%", () => expect(spinOutcome(0.12, 0.1, 0.1).win).toBe(false));
  it("taxa de vitória ~12%", () => {
    let w = 0; for (let i = 0; i < 100000; i++) if (spinOutcome(Math.random(), Math.random(), Math.random()).win) w++;
    expect(w / 100000).toBeGreaterThan(0.11); expect(w / 100000).toBeLessThan(0.13);
  });
  it("derrota nunca mostra três iguais", () => {
    for (let i = 0; i < 5000; i++) { const o = spinOutcome(0.5, Math.random(), Math.random()); expect(new Set(o.reels).size > 1).toBe(true); }
  });
});
