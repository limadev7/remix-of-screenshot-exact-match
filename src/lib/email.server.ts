const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

/** Envia um e-mail pelo Resend (conta própria). Nunca lança erro: falha de e-mail não pode quebrar o site. */
export async function sendEmail(to: string, subject: string, html: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) return console.error("Resend não configurado");
  const from = process.env["RESEND_FROM"] || "7MBET <onboarding@resend.dev>";
  const r = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": resendKey },
    body: JSON.stringify({ from, to: [to], subject, html }),
  }).catch((e) => { console.error("Resend falhou", e); return null; });
  if (r && !r.ok) console.error(`Resend [${r.status}]: ${await r.text()}`);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function welcomeHtml(name: string) {
  return `<div style="font-family:Arial,sans-serif;background:#ffffff;padding:24px">
  <div style="max-width:480px;margin:auto;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:#062653;padding:20px;font-size:26px;font-weight:800;font-style:italic;color:#ffffff">7M<span style="color:#0789F9">BET</span></div>
    <div style="padding:24px;color:#111827">
      <h1 style="font-size:20px;margin:0 0 12px">Bem-vindo, ${esc(name)}!</h1>
      <p style="margin:0 0 12px">Sua conta no 7MBET está pronta. Você começa com <b>1000 créditos</b> para usar nas partidas.</p>
      <p style="margin:0;color:#6b7280;font-size:13px">Se não foi você quem criou esta conta, ignore este e-mail.</p>
    </div>
  </div></div>`;
}
