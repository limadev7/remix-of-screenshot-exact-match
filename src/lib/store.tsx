import { supabase } from "@/integrations/supabase/client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedMatches, type Match } from "@/data/matches";
import { toggleSelection, potentialReturn, combinedOdd, type Selection } from "@/lib/slip";

interface SimBet { id: string; date: string; selections: Selection[]; stake: number; odd: number; ret: number }

interface Store {
  matches: Match[];
  saveMatch: (m: Match) => void;
  deleteMatch: (id: string) => void;
  resetMatches: () => void;
  slip: Selection[];
  toggle: (s: Selection) => void;
  removeSel: (matchId: string) => void;
  clearSlip: () => void;
  stake: number;
  setStake: (n: number) => void;
  balance: number;
  history: SimBet[];
  placeBet: () => boolean;
  user: string | null;
  setUser: (u: string | null) => void;
  slipOpen: boolean;
  setSlipOpen: (b: boolean) => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "7mbet-v2";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>(seedMatches);
  const [slip, setSlip] = useState<Selection[]>([]);
  const [stake, setStake] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState<SimBet[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [slipOpen, setSlipOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.matches) setMatches(d.matches);
        if (d.slip) setSlip(d.slip);
        if (d.stake) setStake(d.stake);
        if (typeof d.balance === "number") setBalance(d.balance);
        if (d.history) setHistory(d.history);
      }
    } catch { /* ignora dados inválidos */ }
    setLoaded(true);
    const nameOf = (u: { email?: string; user_metadata?: Record<string, unknown> } | null | undefined) =>
      u ? String(u.user_metadata?.nickname || u.user_metadata?.full_name || u.email?.split("@")[0] || "Conta") : null;
    supabase.auth.getSession().then(({ data }) => setUser(nameOf(data.session?.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(nameOf(session?.user)));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({ matches, slip, stake, balance, history }));
  }, [loaded, matches, slip, stake, balance, history, user]);

  const placeBet = useCallback(() => {
    if (slip.length === 0 || stake <= 0 || stake > balance) return false;
    const bet: SimBet = {
      id: crypto.randomUUID(), date: new Date().toISOString(), selections: slip, stake,
      odd: combinedOdd(slip), ret: potentialReturn(stake, slip),
    };
    setHistory((h) => [bet, ...h].slice(0, 20));
    setBalance((b) => Math.round((b - stake) * 100) / 100);
    setSlip([]);
    return true;
  }, [slip, stake, balance]);

  const value = useMemo<Store>(() => ({
    matches,
    saveMatch: (m) => setMatches((list) => list.some((x) => x.id === m.id) ? list.map((x) => (x.id === m.id ? m : x)) : [m, ...list]),
    deleteMatch: (id) => setMatches((l) => l.filter((x) => x.id !== id)),
    resetMatches: () => { setMatches(seedMatches()); setSlip([]); setBalance(1000); setHistory([]); },
    slip,
    toggle: (s) => setSlip((l) => toggleSelection(l, s)),
    removeSel: (id) => setSlip((l) => l.filter((s) => s.matchId !== id)),
    clearSlip: () => setSlip([]),
    stake, setStake, balance, history, placeBet, user, setUser, slipOpen, setSlipOpen,
  }), [matches, slip, stake, balance, history, placeBet, user, slipOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore fora do StoreProvider");
  return c;
}
