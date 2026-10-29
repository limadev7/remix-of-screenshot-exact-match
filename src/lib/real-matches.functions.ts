import { createServerFn } from "@tanstack/react-start";
import type { Match, Sport, Status } from "@/data/matches";

export type RealMatch = Match & { homeLogo?: string; awayLogo?: string; homeAbbr?: string; awayAbbr?: string };

const LEAGUES: { path: string; name: string; sport: Sport }[] = [
  { path: "soccer/bra.1", name: "Brasileirão Série A", sport: "futebol" },
  { path: "soccer/uefa.champions", name: "Champions League", sport: "futebol" },
  { path: "soccer/eng.1", name: "Premier League", sport: "futebol" },
  { path: "soccer/esp.1", name: "La Liga", sport: "futebol" },
  { path: "basketball/nba", name: "NBA", sport: "basquete" },
];

let cache: { at: number; data: RealMatch[] } | null = null;

function odd(seed: string, base: number) {
  const h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return Math.round((base + (h % 180) / 100) * 100) / 100;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMatch(ev: any, lg: (typeof LEAGUES)[number]): RealMatch | null {
  const comp = ev.competitions?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h = comp?.competitors?.find((c: any) => c.homeAway === "home");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = comp?.competitors?.find((c: any) => c.homeAway === "away");
  if (!h || !a) return null;
  const state = ev.status?.type?.state;
  const status: Status = state === "in" ? "live" : state === "post" ? "finished" : "upcoming";
  const local = new Date(new Date(ev.date).getTime() - 3 * 3600_000).toISOString().slice(0, 16);
  const clock = parseInt(String(ev.status?.displayClock ?? "0"), 10) || 0;
  const minute = lg.sport === "futebol" ? clock : (ev.status?.period ?? 1) * 12;
  return {
    id: `espn-${ev.id}`,
    sport: lg.sport,
    league: lg.name,
    home: h.team.displayName,
    away: a.team.displayName,
    homeLogo: h.team.logo, awayLogo: a.team.logo,
    homeAbbr: h.team.abbreviation, awayAbbr: a.team.abbreviation,
    date: local,
    status,
    scoreHome: Number(h.score ?? 0) || 0,
    scoreAway: Number(a.score ?? 0) || 0,
    minute,
    odds: {
      home: odd(ev.id + "h", 1.5),
      draw: lg.sport === "futebol" ? odd(ev.id + "d", 2.9) : null,
      away: odd(ev.id + "a", 1.8),
    },
    featured: status === "live",
  };
}

export const fetchRealMatches = createServerFn({ method: "GET" }).handler(async (): Promise<RealMatch[]> => {
  if (cache && Date.now() - cache.at < 60_000) return cache.data;
  const now = new Date(Date.now() - 3 * 3600_000);
  const y = now.getUTCFullYear(), mo = now.getUTCMonth();
  const days = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
  const jobs: Promise<RealMatch[]>[] = [];
  for (const lg of LEAGUES) {
    for (let d = 1; d <= days; d++) {
      const ds = `${y}${String(mo + 1).padStart(2, "0")}${String(d).padStart(2, "0")}`;
      jobs.push(
        fetch(`https://site.api.espn.com/apis/site/v2/sports/${lg.path}/scoreboard?dates=${ds}`)
          .then((r) => (r.ok ? r.json() : { events: [] }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((j: any) => (j.events ?? []).map((e: unknown) => toMatch(e, lg)).filter(Boolean) as RealMatch[])
          .catch(() => []),
      );
    }
  }
  const all = (await Promise.all(jobs)).flat();
  const uniq = [...new Map(all.map((m) => [m.id, m])).values()];
  if (uniq.length) cache = { at: Date.now(), data: uniq };
  return uniq;
});
