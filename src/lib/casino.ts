export const WIN_CHANCE = 0.12;
export const SYMBOLS = ["🐯", "🐰", "💰", "🍊", "🧧", "💎"] as const;

/** Uma rodada: ganha com 12% de chance. r1 decide ganhar, r2 o multiplicador/símbolo. */
export function spinOutcome(r1: number, r2: number, r3: number) {
  const win = r1 < WIN_CHANCE;
  if (win) {
    const mult = r2 < 0.6 ? 2 : r2 < 0.9 ? 5 : 10;
    const sym = SYMBOLS[mult === 10 ? 5 : mult === 5 ? 0 : Math.floor(r3 * 4) + 1];
    return { win, mult, reels: [sym, sym, sym] };
  }
  const a = Math.floor(r2 * 6), b = (a + 1 + Math.floor(r3 * 5)) % 6, c = Math.floor(((r2 + r3) % 1) * 6);
  return { win, mult: 0, reels: [SYMBOLS[a], SYMBOLS[b], SYMBOLS[c]] };
}
