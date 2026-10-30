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
