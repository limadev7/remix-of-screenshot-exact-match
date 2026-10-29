import { describe, expect, it } from "vitest";
import { combinedOdd, potentialReturn, toggleSelection, type Selection } from "@/lib/slip";

const s = (matchId: string, pick: Selection["pick"], odd: number): Selection => ({
  matchId, pick, odd, label: "", pickLabel: "",
});

describe("cupom demonstrativo", () => {
  it("permite só uma seleção por partida (troca o resultado)", () => {
    const list = toggleSelection([s("m1", "home", 2)], s("m1", "away", 3));
    expect(list).toHaveLength(1);
    expect(list[0].pick).toBe("away");
  });
  it("clicar na mesma odd remove a seleção", () => {
    expect(toggleSelection([s("m1", "home", 2)], s("m1", "home", 2))).toHaveLength(0);
  });
  it("odd combinada é o produto das odds", () => {
    expect(combinedOdd([s("a", "home", 2), s("b", "draw", 1.5)])).toBe(3);
  });
  it("retorno teórico = valor × odd combinada", () => {
    expect(potentialReturn(10, [s("a", "home", 2), s("b", "draw", 1.5)])).toBe(30);
  });
});
