export type Sport = "futebol" | "basquete" | "tenis";
export type Status = "upcoming" | "live" | "finished";

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  home: string;
  away: string;
  date: string; // ISO yyyy-mm-ddThh:mm
  status: Status;
  scoreHome: number;
  scoreAway: number;
  minute: number;
  odds: { home: number; draw: number | null; away: number };
  featured?: boolean;
}

export const STATUS_LABEL: Record<Status, string> = {
  upcoming: "Em breve",
  live: "Ao vivo",
  finished: "Encerrada",
};

export const SPORT_LABEL: Record<Sport, string> = {
  futebol: "Futebol",
  basquete: "Basquete",
  tenis: "Tênis",
};

function day(offset: number, time: string) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.toISOString().slice(0, 10)}T${time}`;
}

let n = 0;
const m = (p: Omit<Match, "id" | "scoreHome" | "scoreAway" | "minute"> & Partial<Match>): Match => ({
  id: `m${++n}`,
  scoreHome: 0,
  scoreAway: 0,
  minute: 0,
  ...p,
});

export function seedMatches(): Match[] {
  n = 0;
  return [
    m({ sport: "futebol", league: "Brasileirão Série A", home: "Flamengo", away: "Palmeiras", date: day(0, "16:00"), status: "live", scoreHome: 1, scoreAway: 1, minute: 57, odds: { home: 2.35, draw: 3.1, away: 2.9 }, featured: true }),
    m({ sport: "futebol", league: "Champions League", home: "Real Madrid", away: "Manchester City", date: day(0, "17:00"), status: "live", scoreHome: 2, scoreAway: 0, minute: 23, odds: { home: 2.45, draw: 3.4, away: 2.7 } }),
    m({ sport: "futebol", league: "Brasileirão Série A", home: "Corinthians", away: "São Paulo", date: day(0, "21:00"), status: "upcoming", odds: { home: 2.5, draw: 3.1, away: 2.9 }, featured: true }),
    m({ sport: "futebol", league: "Premier League", home: "Liverpool", away: "Arsenal", date: day(1, "13:30"), status: "upcoming", odds: { home: 2.1, draw: 3.5, away: 3.3 }, featured: true }),
    m({ sport: "futebol", league: "Champions League", home: "Barcelona", away: "Bayern de Munique", date: day(1, "17:00"), status: "upcoming", odds: { home: 2.2, draw: 3.6, away: 3.0 } }),
    m({ sport: "futebol", league: "Brasileirão Série A", home: "Atlético Mineiro", away: "Grêmio", date: day(2, "19:00"), status: "upcoming", odds: { home: 1.9, draw: 3.4, away: 4.1 } }),
    m({ sport: "futebol", league: "Brasileirão Série A", home: "Fluminense", away: "Botafogo", date: day(-1, "18:30"), status: "finished", scoreHome: 1, scoreAway: 2, odds: { home: 2.6, draw: 3.1, away: 2.7 } }),
    m({ sport: "futebol", league: "Brasileirão Série A", home: "Internacional", away: "Santos", date: day(-1, "20:00"), status: "finished", scoreHome: 0, scoreAway: 0, odds: { home: 1.85, draw: 3.4, away: 4.3 } }),
    m({ sport: "futebol", league: "Premier League", home: "Chelsea", away: "Manchester United", date: day(-2, "12:30"), status: "finished", scoreHome: 3, scoreAway: 1, odds: { home: 2.0, draw: 3.5, away: 3.6 } }),
    m({ sport: "futebol", league: "Champions League", home: "PSG", away: "Juventus", date: day(-2, "17:00"), status: "finished", scoreHome: 1, scoreAway: 1, odds: { home: 1.75, draw: 3.8, away: 4.5 } }),
    m({ sport: "basquete", league: "NBA", home: "Los Angeles Lakers", away: "Boston Celtics", date: day(0, "20:00"), status: "live", scoreHome: 68, scoreAway: 71, minute: 31, odds: { home: 1.9, draw: null, away: 1.88 }, featured: true }),
    m({ sport: "basquete", league: "NBA", home: "Golden State Warriors", away: "Chicago Bulls", date: day(1, "23:00"), status: "upcoming", odds: { home: 1.55, draw: null, away: 2.45 } }),
    m({ sport: "basquete", league: "NBA", home: "Miami Heat", away: "New York Knicks", date: day(-1, "21:30"), status: "finished", scoreHome: 102, scoreAway: 97, odds: { home: 2.05, draw: null, away: 1.78 } }),
    m({ sport: "tenis", league: "ATP Paris Masters", home: "J. Sinner", away: "C. Alcaraz", date: day(0, "14:00"), status: "live", scoreHome: 1, scoreAway: 0, minute: 64, odds: { home: 1.85, draw: null, away: 1.95 } }),
    m({ sport: "tenis", league: "ATP Paris Masters", home: "J. Fonseca", away: "N. Djokovic", date: day(1, "13:00"), status: "upcoming", odds: { home: 2.3, draw: null, away: 1.62 }, featured: true }),
    m({ sport: "tenis", league: "ATP Paris Masters", home: "A. Zverev", away: "D. Medvedev", date: day(-2, "11:00"), status: "finished", scoreHome: 2, scoreAway: 1, odds: { home: 1.8, draw: null, away: 2.0 } }),
  ];
}

export const POPULAR_LEAGUES = [
  { name: "Brasileirão Série A", sport: "futebol" as Sport },
  { name: "Champions League", sport: "futebol" as Sport },
  { name: "Premier League", sport: "futebol" as Sport },
  { name: "La Liga", sport: "futebol" as Sport },
  { name: "NBA", sport: "basquete" as Sport },
  { name: "ATP Paris Masters", sport: "tenis" as Sport },
]

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "") +
    " · " + iso.slice(11, 16);
}
