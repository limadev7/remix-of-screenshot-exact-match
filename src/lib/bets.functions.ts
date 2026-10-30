import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { loadRealMatches, type RealMatch } from "@/lib/real-matches.functions";
import { combinedOdd, type Selection } from "@/lib/slip";
import { settleOutcome } from "@/lib/settle";

export interface BetRow {
  id: string; selections: Selection[]; stake: number; odd: number;
  potential_return: number; status: string; created_at: string;
}

export const placeBet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { selections: Selection[]; stake: number }) => d)
  .handler(async ({ data, context }) => {
    const stake = Math.round(Number(data.stake) * 100) / 100;
    if (!Array.isArray(data.selections) || !data.selections.length || data.selections.length > 20) throw new Error("Cupom inválido");
    if (!(stake > 0)) throw new Error("Valor inválido");
    const real = new Map((await loadRealMatches()).map((m) => [m.id, m]));
    const clean: Selection[] = data.selections.map((s) => {
      const m = real.get(s.matchId);
      if (!m || m.status !== "upcoming") throw new Error("Uma partida do cupom já começou ou não está disponível");
      const o = m.odds[s.pick];
      if (o == null) throw new Error("Opção inválida");
      const pickLabel = s.pick === "home" ? m.home : s.pick === "away" ? m.away : "Empate";
      return { matchId: m.id, pick: s.pick, odd: o, label: `${m.home} x ${m.away}`, pickLabel };
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("place_bet", {
      _user: context.userId, _selections: clean as never, _stake: stake, _odd: combinedOdd(clean),
    });
    if (error) throw new Error(error.message.includes("Saldo") ? "Saldo insuficiente" : "Não foi possível registrar a aposta");
    return { ok: true };
  });

export const getAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const pending = await supabase.from("bets").select("id, selections").eq("user_id", userId).eq("status", "pending");
    if (pending.data?.length) {
      const real = new Map<string, RealMatch>((await loadRealMatches()).map((m) => [m.id, m]));
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      for (const b of pending.data) {
        const r = settleOutcome(b.selections as unknown as Selection[], real);
        if (r !== "pending") await supabaseAdmin.rpc("settle_bet", { _bet: b.id, _won: r === "won" });
      }
    }
    const [w, bets] = await Promise.all([
      supabase.from("wallets").select("balance").eq("user_id", userId).maybeSingle(),
      supabase.from("bets").select("id, selections, stake, odd, potential_return, status, created_at")
        .eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
    ]);
    return {
      balance: w.data ? Number(w.data.balance) : 1000,
      bets: (bets.data ?? []).map((b) => ({ ...b, stake: Number(b.stake), odd: Number(b.odd), potential_return: Number(b.potential_return) })) as unknown as BetRow[],
    };
  });

export interface Metrics {
  users: number; bets: number; pending: number; won: number; lost: number;
  staked: number; paid: number; top: { name: string; n: number }[];
}

export const getMetrics = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { data, error } = await sb.rpc("get_metrics");
  if (error) throw new Error("Falha ao carregar métricas");
  return data as unknown as Metrics;
});
