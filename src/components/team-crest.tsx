// Escudos e siglas gerados para cada clube/jogador (cores de cada equipe = conteúdo).
type Crest = { sigla: string; c1: string; c2: string; shape: "shield" | "round" | "hex" };

const CRESTS: Record<string, Crest> = {
  "Atlético Aurora": { sigla: "ATA", c1: "#c8102e", c2: "#111111", shape: "shield" },
  "Real Vale Verde": { sigla: "RVV", c1: "#0b7a3b", c2: "#ffffff", shape: "shield" },
  "Porto Azul FC": { sigla: "PAZ", c1: "#0057b8", c2: "#ffffff", shape: "round" },
  "União Serrana": { sigla: "UNS", c1: "#6b2c91", c2: "#f2c230", shape: "shield" },
  "Esporte Litoral": { sigla: "ESL", c1: "#f28c00", c2: "#0a2240", shape: "hex" },
  "Grêmio Planalto": { sigla: "GPL", c1: "#1e3a8a", c2: "#38bdf8", shape: "shield" },
  "Northbridge United": { sigla: "NBU", c1: "#b91c1c", c2: "#fde047", shape: "round" },
  "Castelo Rovers": { sigla: "CRO", c1: "#0f172a", c2: "#e5e7eb", shape: "shield" },
  "Deportivo Sol": { sigla: "DSO", c1: "#facc15", c2: "#b45309", shape: "round" },
  "Real Montanha": { sigla: "RMO", c1: "#ffffff", c2: "#4c1d95", shape: "shield" },
  "Olímpico Rio Claro": { sigla: "ORC", c1: "#0891b2", c2: "#ffffff", shape: "hex" },
  "Trovões da Capital": { sigla: "TRC", c1: "#1d4ed8", c2: "#facc15", shape: "round" },
  "Falcões do Sul": { sigla: "FAS", c1: "#991b1b", c2: "#f5f5f4", shape: "hex" },
  "Leões Metropolitanos": { sigla: "LEM", c1: "#ca8a04", c2: "#111827", shape: "shield" },
  "Tubarões da Baía": { sigla: "TUB", c1: "#0e7490", c2: "#e0f2fe", shape: "round" },
  "L. Andrade": { sigla: "BRA", c1: "#009c3b", c2: "#ffdf00", shape: "round" },
  "M. Kovacs": { sigla: "HUN", c1: "#cd2a3e", c2: "#436f4d", shape: "round" },
  "R. Silveira": { sigla: "POR", c1: "#006600", c2: "#ff0000", shape: "round" },
  "T. Nakamura": { sigla: "JPN", c1: "#ffffff", c2: "#bc002d", shape: "round" },
  "J. Ferreira": { sigla: "BRA", c1: "#009c3b", c2: "#ffdf00", shape: "round" },
  "A. Lindqvist": { sigla: "SWE", c1: "#006aa7", c2: "#fecc00", shape: "round" },
};

const FALLBACK = ["#0789f9", "#062653", "#16a34a", "#dc2626", "#7c3aed", "#ea580c"];

export function getCrest(name: string): Crest {
  if (CRESTS[name]) return CRESTS[name];
  const words = name.replace(/\./g, "").split(" ").filter(Boolean);
  const sigla = (words.length > 1 ? words.map((w) => w[0]).join("") : name).slice(0, 3).toUpperCase();
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return { sigla, c1: FALLBACK[h % FALLBACK.length], c2: "#ffffff", shape: "shield" };
}

const isPlayer = (name: string) => /^[A-Z]\.\s/.test(name);

function initials(name: string) {
  return name.replace(/\./g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function TeamCrest({ name, size = "h-9 w-9" }: { name: string; size?: string }) {
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
