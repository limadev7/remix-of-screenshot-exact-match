// Escudos e siglas gerados para cada clube/jogador (cores de cada equipe = conteúdo).
type Crest = { sigla: string; c1: string; c2: string; shape: "shield" | "round" | "hex" };

const F = (id: number) => `https://media.api-sports.io/football/teams/${id}.png`;
const N = (c: string) => `https://a.espncdn.com/i/teamlogos/nba/500/${c}.png`;
const FL = (c: string) => `https://flagcdn.com/w160/${c}.png`;

// Logos reais dos clubes / bandeiras dos tenistas + siglas
const LOGOS: Record<string, { sigla: string; src: string; flag?: boolean }> = {
  Flamengo: { sigla: "FLA", src: F(127) }, Palmeiras: { sigla: "PAL", src: F(121) },
  Corinthians: { sigla: "COR", src: F(131) }, "São Paulo": { sigla: "SAO", src: F(126) },
  Santos: { sigla: "SAN", src: F(128) }, "Grêmio": { sigla: "GRE", src: F(130) },
  Internacional: { sigla: "INT", src: F(119) }, "Atlético Mineiro": { sigla: "CAM", src: F(1062) },
  Fluminense: { sigla: "FLU", src: F(124) }, Botafogo: { sigla: "BOT", src: F(120) },
  "Real Madrid": { sigla: "RMA", src: F(541) }, Barcelona: { sigla: "BAR", src: F(529) },
  "Manchester City": { sigla: "MCI", src: F(50) }, Liverpool: { sigla: "LIV", src: F(40) },
  Arsenal: { sigla: "ARS", src: F(42) }, PSG: { sigla: "PSG", src: F(85) },
  "Bayern de Munique": { sigla: "BAY", src: F(157) }, Chelsea: { sigla: "CHE", src: F(49) },
  "Manchester United": { sigla: "MUN", src: F(33) }, Juventus: { sigla: "JUV", src: F(496) },
  "Los Angeles Lakers": { sigla: "LAL", src: N("lal") }, "Boston Celtics": { sigla: "BOS", src: N("bos") },
  "Golden State Warriors": { sigla: "GSW", src: N("gs") }, "Chicago Bulls": { sigla: "CHI", src: N("chi") },
  "Miami Heat": { sigla: "MIA", src: N("mia") }, "New York Knicks": { sigla: "NYK", src: N("ny") },
  "J. Sinner": { sigla: "ITA", src: FL("it"), flag: true }, "C. Alcaraz": { sigla: "ESP", src: FL("es"), flag: true },
  "N. Djokovic": { sigla: "SRB", src: FL("rs"), flag: true }, "J. Fonseca": { sigla: "BRA", src: FL("br"), flag: true },
  "A. Zverev": { sigla: "GER", src: FL("de"), flag: true }, "D. Medvedev": { sigla: "RUS", src: FL("ru"), flag: true },
};

const CRESTS: Record<string, Crest> = {};

export function registerLogo(name: string, sigla: string | undefined, src: string | undefined) {
  if (!src || LOGOS[name]) return;
  LOGOS[name] = { sigla: (sigla || name.slice(0, 3)).toUpperCase(), src };
}

const FALLBACK = ["#0789f9", "#062653", "#16a34a", "#dc2626", "#7c3aed", "#ea580c"];

export function getCrest(name: string): Crest {
  if (LOGOS[name]) return { sigla: LOGOS[name].sigla, c1: "#0789f9", c2: "#ffffff", shape: "round" };
  if (CRESTS[name]) return CRESTS[name];
  const words = name.replace(/\./g, "").split(" ").filter(Boolean);
  const sigla = (words.length > 1 ? words.map((w) => w[0]).join("") : name).slice(0, 3).toUpperCase();
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { sigla, c1: FALLBACK[h % FALLBACK.length] ?? "#0789f9", c2: "#ffffff", shape: "shield" };
}

const isPlayer = (name: string) => /^[A-Z]\.\s/.test(name);

function initials(name: string) {
  return name.replace(/\./g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function TeamCrest({ name, size = "h-9 w-9" }: { name: string; size?: string }) {
  const logo = LOGOS[name];
  if (logo)
    return (
      <img src={logo.src} alt={logo.flag ? `Bandeira ${logo.sigla}` : `Escudo ${name}`} loading="lazy"
        className={`${size} shrink-0 ${logo.flag ? "rounded-full object-cover ring-2 ring-border" : "object-contain"}`} />
    );
  const c = getCrest(name);
  const id = `g${c.sigla}${c.c1.slice(1)}`;
  const light = ["#ffffff", "#facc15", "#ffdf00", "#e5e7eb"].includes(c.c1);
  const text = light ? "#111827" : "#ffffff";

  if (isPlayer(name)) {
    // Foto/avatar do jogador com faixa da bandeira
    return (
      <svg viewBox="0 0 40 40" className={`${size} shrink-0 drop-shadow-sm`} role="img" aria-label={name}>
        <defs><clipPath id={`${id}p`}><circle cx="20" cy="20" r="19" /></clipPath></defs>
        <g clipPath={`url(#${id}p)`}>
          <rect width="40" height="40" fill="#1f2937" />
          <circle cx="20" cy="15" r="7" fill="#e5c4a1" />
          <path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill={c.c1} />
          <rect y="33" width="40" height="7" fill={c.c2} opacity=".9" />
        </g>
        <circle cx="20" cy="20" r="19" fill="none" stroke={c.c2} strokeWidth="1.5" />
        <text x="20" y="38.5" textAnchor="middle" fontSize="5.5" fontWeight="800" fill={light ? "#111" : c.c1 === c.c2 ? "#fff" : "#111"} fontFamily="Barlow Condensed, sans-serif">{initials(name)}</text>
      </svg>
    );
  }

  const outline =
    c.shape === "shield" ? "M20 2 L36 7 V19 C36 29 29 35 20 38 C11 35 4 29 4 19 V7 Z"
    : c.shape === "hex" ? "M20 2 L36 11 V29 L20 38 L4 29 V11 Z"
    : "M20 2 A18 18 0 1 1 19.99 2 Z";

  return (
    <svg viewBox="0 0 40 40" className={`${size} shrink-0 drop-shadow-sm`} role="img" aria-label={`Escudo ${name}`}>
      <defs><clipPath id={id}><path d={outline} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect width="40" height="40" fill={c.c1} />
        <rect x="14" width="12" height="40" fill={c.c2} opacity=".85" />
        <rect y="13" width="40" height="13" fill={c.c1} />
      </g>
      <path d={outline} fill="none" stroke={c.c2} strokeWidth="2" />
      <path d={outline} fill="none" stroke="#000" strokeOpacity=".25" strokeWidth=".6" />
      <text x="20" y="23.5" textAnchor="middle" fontSize="10" fontWeight="800" fill={text} fontFamily="Barlow Condensed, sans-serif" letterSpacing=".3">{c.sigla}</text>
    </svg>
  );
}
