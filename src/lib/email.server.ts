import { renderTemplate, subjectOf, type TemplateName, type TemplateProps } from "@/email";

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

/** Renderiza um template do site (src/email) e envia pelo Resend. */
export async function sendTemplate<K extends TemplateName>(name: K, to: string, props: TemplateProps[K]) {
  try {
    const html = await renderTemplate(name, props);
    await sendEmail(to, subjectOf(name, props), html);
  } catch (e) {
    console.error(`Falha ao enviar e-mail "${name}"`, e);
  }
}
