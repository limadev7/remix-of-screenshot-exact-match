export type Pick = "home" | "draw" | "away";

export interface Selection {
  matchId: string;
  pick: Pick;
  odd: number;
  label: string; // ex: "Flamengo x Palmeiras"
  pickLabel: string; // ex: "Flamengo"
}

/** Uma seleção por partida: mesma odd remove, outra odd substitui. */
export function toggleSelection(list: Selection[], sel: Selection): Selection[] {
  const existing = list.find((s) => s.matchId === sel.matchId);
  if (existing && existing.pick === sel.pick) return list.filter((s) => s.matchId !== sel.matchId);
  if (existing) return list.map((s) => (s.matchId === sel.matchId ? sel : s));
  return [...list, sel];
}

/** Odd combinada = produto das odds, arredondada em 2 casas. */
export function combinedOdd(list: Selection[]): number {
  if (list.length === 0) return 0;
  return Math.round(list.reduce((acc, s) => acc * s.odd, 1) * 100) / 100;
}

/** Retorno teórico = valor × odd combinada. */
export function potentialReturn(stake: number, list: Selection[]): number {
  if (!stake || stake <= 0 || list.length === 0) return 0;
  return Math.round(stake * combinedOdd(list) * 100) / 100;
}
