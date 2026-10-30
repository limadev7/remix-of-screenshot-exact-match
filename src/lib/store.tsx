import { supabase } from "@/integrations/supabase/client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Match } from "@/data/matches";
import { fetchRealMatches } from "@/lib/real-matches.functions";
import { getAccount, placeBet as placeBetFn, type BetRow } from "@/lib/bets.functions";
import { registerLogo } from "@/components/team-crest";
import { toggleSelection, type Selection } from "@/lib/slip";

interface Store {
  matches: Match[];
  loadingMatches: boolean;
  slip: Selection[];
  toggle: (s: Selection) => void;
  removeSel: (matchId: string) => void;
  clearSlip: () => void;
  stake: number;
  setStake: (n: number) => void;
  balance: number | null;
  history: BetRow[];
  placeBet: () => Promise<string | null>;
  refreshAccount: () => void;
  user: string | null;
  setUser: (u: string | null) => void;
  slipOpen: boolean;
  setSlipOpen: (b: boolean) => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "7mbet-v3";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [slip, setSlip] = useState<Selection[]>([]);
  const [stake, setStake] = useState(10);
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<BetRow[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [slipOpen, setSlipOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refreshAccount = useCallback(() => {
    getAccount().then((a) => { setBalance(a.balance); setHistory(a.bets); }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      if (d.slip) setSlip(d.slip);
      if (d.stake) setStake(d.stake);
    } catch { /* ignora */ }
    setLoaded(true);
    const loadReal = () => fetchRealMatches().then((real) => {
      real.forEach((m) => { registerLogo(m.home, m.homeAbbr, m.homeLogo); registerLogo(m.away, m.awayAbbr, m.awayLogo); });
      setMatches(real);
    }).catch(() => {}).finally(() => setLoadingMatches(false));
    loadReal();
    const timer = setInterval(loadReal, 60_000);
    const nameOf = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
      u ? String(u.user_metadata?.["nickname"] || u.user_metadata?.["full_name"] || u.email?.split("@")[0] || "Conta") : null;
    const onSession = (u: Parameters<typeof nameOf>[0]) => {
      setUser(nameOf(u));
      if (u) refreshAccount(); else { setBalance(null); setHistory([]); }
    };
    supabase.auth.getSession().then(({ data }) => onSession(data.session?.user));
    const { data: sub } = supabase.auth.onAuthStateChange((e, session) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT" || e === "USER_UPDATED") onSession(session?.user);
    });
    return () => { sub.subscription.unsubscribe(); clearInterval(timer); };
  }, [refreshAccount]);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify({ slip, stake }));
  }, [loaded, slip, stake]);

  const placeBet = useCallback(async () => {
    if (!user) return "Entre na sua conta para apostar.";
    try {
      await placeBetFn({ data: { selections: slip, stake } });
      setSlip([]);
      refreshAccount();
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Erro ao apostar.";
    }
  }, [user, slip, stake, refreshAccount]);

  const value = useMemo<Store>(() => ({
    matches, loadingMatches, slip,
    toggle: (s) => setSlip((l) => toggleSelection(l, s)),
    removeSel: (id) => setSlip((l) => l.filter((s) => s.matchId !== id)),
    clearSlip: () => setSlip([]),
    stake, setStake, balance, history, placeBet, refreshAccount, user, setUser, slipOpen, setSlipOpen,
  }), [matches, loadingMatches, slip, stake, balance, history, placeBet, refreshAccount, user, slipOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore fora do StoreProvider");
  return c;
}
