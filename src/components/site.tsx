import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Home, Trophy, Dribbble, CircleDot, Radio, ListChecks, Search, Menu, X, Ticket, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { BetSlip } from "@/components/bet-slip";

export const DISCLAIMER =
  "7MBET — Futebol, basquete e tênis: partidas, odds e resultados em um só lugar.";

export const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/futebol", label: "Futebol", icon: Trophy },
  { to: "/basquete", label: "Basquete", icon: Dribbble },
  { to: "/tenis", label: "Tênis", icon: CircleDot },
  { to: "/ao-vivo", label: "Ao Vivo", icon: Radio },
  { to: "/resultados", label: "Resultados", icon: ListChecks },
] as const;

export function Logo({ className = "text-2xl", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`font-display font-extrabold italic tracking-tight leading-none ${className}`}>
      <span className={tone === "light" ? "text-foreground" : "text-navy-foreground"}>7M</span>
      <span className="text-primary">BET</span>
    </span>
  );
}

function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/busca", search: { q: q.trim() } });
        onDone?.();
      }}
      className="relative w-full"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar times ou campeonatos"
        aria-label="Buscar times ou campeonatos"
        className="h-10 w-full rounded-md border border-navy-foreground/10 bg-navy-deep pl-9 pr-3 text-sm text-navy-foreground placeholder:text-navy-muted outline-none focus:border-primary"
      />
    </form>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { slip, setSlipOpen, user, balance } = useStore();
  const [menu, setMenu] = useState(false);
  const isHome = useRouterState({ select: (s) => s.location.pathname === "/" });

  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <header className="sticky top-0 z-40 bg-navy text-navy-foreground shadow-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          {!isHome && (
            <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setMenu(true)}>
              <Menu className="h-6 w-6" />
            </button>
          )}
          <Link to="/" aria-label="7MBET início"><Logo /></Link>
          {!isHome && (
            <>
              <div className="hidden flex-1 max-w-sm md:block"><SearchBox /></div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:inline rounded-md bg-navy-deep px-3 py-1.5 text-xs text-navy-muted">
                  Créditos: <b className="text-navy-foreground">{balance == null ? "—" : balance.toFixed(2)}</b>
                </span>
                {user ? (
                  <Link to="/entrar" className="flex items-center gap-1.5 rounded-md bg-navy-deep px-3 py-1.5 text-sm">
                    <User className="h-4 w-4" /> {user}
                  </Link>
                ) : (
                  <>
                    <Link to="/entrar" className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-navy-deep">Entrar</Link>
                    <Link to="/cadastrar" className="hidden sm:inline-flex rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Cadastrar</Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <nav className="hidden lg:block border-t border-navy-foreground/10 bg-navy-deep">
          <div className="mx-auto flex max-w-7xl gap-1 px-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-2 border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-navy-muted transition-colors hover:text-navy-foreground"
                activeProps={{ className: "!border-primary !text-navy-foreground" }}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            <Link to="/admin" className="ml-auto px-4 py-2.5 text-xs text-navy-muted hover:text-navy-foreground">Painel</Link>
          </div>
        </nav>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/70" onClick={() => setMenu(false)} />
          <aside className="fade-up absolute left-0 top-0 h-full w-72 bg-navy p-4 text-navy-foreground">
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <button aria-label="Fechar menu" onClick={() => setMenu(false)}><X className="h-6 w-6" /></button>
            </div>
            <SearchBox onDone={() => setMenu(false)} />
            <div className="mt-4 flex flex-col">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setMenu(false)} activeOptions={{ exact: true }}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-navy-muted"
                  activeProps={{ className: "!bg-navy-deep !text-navy-foreground" }}>
                  <n.icon className="h-5 w-5" /> {n.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setMenu(false)} className="px-3 py-3 text-sm text-navy-muted">Painel administrativo</Link>
            </div>
            <p className="mt-6 text-xs text-navy-muted">Créditos: {balance == null ? "—" : balance.toFixed(2)}</p>
          </aside>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-5">
        <main className="min-w-0 flex-1">{children}</main>
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-28"><BetSlip /></div>
        </aside>
      </div>

      <footer className="bg-navy text-navy-muted">
        <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <Logo className="text-xl" />
            <p className="mt-2 text-sm">A emoção do esporte em um só lugar.</p>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-navy-foreground">{n.label}</Link>)}
          </div>
          <p className="text-xs leading-relaxed">{DISCLAIMER}</p>
        </div>
      </footer>

      {/* Navegação inferior no celular */}
      <nav className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 border-t border-navy-foreground/10 bg-navy text-navy-muted lg:hidden">
        {[NAV[0], NAV[1], NAV[4], NAV[5]].map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex flex-col items-center gap-0.5 py-2 text-[11px]"
            activeProps={{ className: "!text-primary" }}>
            <n.icon className="h-5 w-5" /> {n.label}
          </Link>
        ))}
        <button onClick={() => setSlipOpen(true)} className="relative flex flex-col items-center gap-0.5 py-2 text-[11px]">
          <Ticket className="h-5 w-5" /> Cupom
          {slip.length > 0 && (
            <span className="absolute right-4 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{slip.length}</span>
          )}
        </button>
      </nav>
      <MobileSlip />
    </div>
  );
}

function MobileSlip() {
  const { slipOpen, setSlipOpen } = useStore();
  if (!slipOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy-deep/70" onClick={() => setSlipOpen(false)} />
      <div className="fade-up absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-background p-3">
        <BetSlip onClose={() => setSlipOpen(false)} />
      </div>
    </div>
  );
}

export function SimNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="rounded-md border border-primary/20 bg-accent px-3 py-2 text-xs text-accent-foreground">
      {children ?? "Odds e resultados atualizados em tempo real."}
    </p>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <h2 className="text-2xl font-bold uppercase italic tracking-tight text-navy">{children}</h2>
      {action}
    </div>
  );
}
