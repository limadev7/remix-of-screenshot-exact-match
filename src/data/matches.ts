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
    m({ sport: "futebol", league: "Liga Nacional Série A", home: "Atlético Aurora", away: "Real Vale Verde", date: day(0, "16:00"), status: "live", scoreHome: 1, scoreAway: 1, minute: 57, odds: { home: 2.35, draw: 3.1, away: 2.9 }, featured: true }),
    m({ sport: "futebol", league: "Copa Continental", home: "Porto Azul FC", away: "União Serrana", date: day(0, "17:30"), status: "live", scoreHome: 2, scoreAway: 0, minute: 23, odds: { home: 1.45, draw: 4.2, away: 6.5 } }),
    m({ sport: "futebol", league: "Liga Nacional Série A", home: "Esporte Litoral", away: "Grêmio Planalto", date: day(0, "21:00"), status: "upcoming", odds: { home: 1.95, draw: 3.4, away: 3.8 }, featured: true }),
    m({ sport: "futebol", league: "Liga Europeia Fictícia", home: "Northbridge United", away: "Castelo Rovers", date: day(1, "15:45"), status: "upcoming", odds: { home: 2.1, draw: 3.3, away: 3.4 }, featured: true }),
    m({ sport: "futebol", league: "Copa Continental", home: "Deportivo Sol", away: "Atlético Aurora", date: day(1, "19:00"), status: "upcoming", odds: { home: 3.2, draw: 3.25, away: 2.2 } }),
    m({ sport: "futebol", league: "Liga Europeia Fictícia", home: "Real Montanha", away: "Olímpico Rio Claro", date: day(2, "16:00"), status: "upcoming", odds: { home: 1.7, draw: 3.75, away: 4.6 } }),
    m({ sport: "futebol", league: "Liga Nacional Série A", home: "Real Vale Verde", away: "Porto Azul FC", date: day(-1, "18:00"), status: "finished", scoreHome: 3, scoreAway: 1, odds: { home: 2.4, draw: 3.2, away: 2.8 } }),
    m({ sport: "futebol", league: "Copa Continental", home: "União Serrana", away: "Esporte Litoral", date: day(-1, "20:30"), status: "finished", scoreHome: 0, scoreAway: 0, odds: { home: 2.6, draw: 3.0, away: 2.7 } }),
    m({ sport: "futebol", league: "Liga Europeia Fictícia", home: "Castelo Rovers", away: "Real Montanha", date: day(-2, "16:00"), status: "finished", scoreHome: 1, scoreAway: 2, odds: { home: 2.2, draw: 3.3, away: 3.1 } }),
    m({ sport: "basquete", league: "Liga Pro de Basquete", home: "Trovões da Capital", away: "Falcões do Sul", date: day(0, "20:00"), status: "live", scoreHome: 68, scoreAway: 71, minute: 31, odds: { home: 1.9, draw: null, away: 1.88 }, featured: true }),
    m({ sport: "basquete", league: "Liga Pro de Basquete", home: "Leões Metropolitanos", away: "Tubarões da Baía", date: day(1, "21:30"), status: "upcoming", odds: { home: 1.65, draw: null, away: 2.25 } }),
    m({ sport: "basquete", league: "Copa Interligas", home: "Falcões do Sul", away: "Leões Metropolitanos", date: day(-1, "19:00"), status: "finished", scoreHome: 102, scoreAway: 97, odds: { home: 2.05, draw: null, away: 1.78 } }),
    m({ sport: "tenis", league: "Open Costa Dourada", home: "L. Andrade", away: "M. Kovacs", date: day(0, "14:00"), status: "live", scoreHome: 1, scoreAway: 0, minute: 64, odds: { home: 1.55, draw: null, away: 2.45 } }),
    m({ sport: "tenis", league: "Open Costa Dourada", home: "R. Silveira", away: "T. Nakamura", date: day(1, "13:00"), status: "upcoming", odds: { home: 2.3, draw: null, away: 1.62 }, featured: true }),
    m({ sport: "tenis", league: "Masters do Norte", home: "J. Ferreira", away: "A. Lindqvist", date: day(-2, "11:00"), status: "finished", scoreHome: 2, scoreAway: 1, odds: { home: 1.8, draw: null, away: 2.0 } }),
  ];
}

export const POPULAR_LEAGUES = [
  { name: "Liga Nacional Série A", sport: "futebol" as Sport },
  { name: "Copa Continental", sport: "futebol" as Sport },
  { name: "Liga Europeia Fictícia", sport: "futebol" as Sport },
  { name: "Liga Pro de Basquete", sport: "basquete" as Sport },
  { name: "Open Costa Dourada", sport: "tenis" as Sport },
];

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "") +
    " · " + iso.slice(11, 16);
}
