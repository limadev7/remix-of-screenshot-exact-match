import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { spinOutcome } from "@/lib/casino";

export const spin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { stake: number }) => d)
  .handler(async ({ data, context }) => {
    const stake = Math.round(Number(data.stake) * 100) / 100;
    if (!(stake > 0) || stake > 10000) throw new Error("Valor inválido");
    const r = crypto.getRandomValues(new Uint32Array(3));
    const o = spinOutcome(r[0] / 2 ** 32, r[1] / 2 ** 32, r[2] / 2 ** 32);
    const payout = stake * o.mult;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: bal, error } = await supabaseAdmin.rpc("casino_spin", { _user: context.userId, _stake: stake, _payout: payout });
    if (error) throw new Error(error.message.includes("Saldo") ? "Saldo insuficiente" : "Erro na rodada");
    return { ...o, payout, balance: Number(bal) };
  });
