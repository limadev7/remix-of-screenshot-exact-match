import type { ReactNode } from "react";
import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";

export const BRAND = {
  navy: "#062653",
  blue: "#0789F9",
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  soft: "#f3f4f6",
  danger: "#dc2626",
  success: "#0f8a4d",
};

export const SITE_URL = process.env["SITE_URL"] || "https://pixel-perfect-picture-maker-35.lovable.app";

export const buttonStyle = (bg: string = BRAND.blue) => ({
  backgroundColor: bg,
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "15px",
  fontWeight: "700" as const,
  textDecoration: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  display: "inline-block",
});

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BRAND.soft, margin: "0", padding: "24px 12px", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: "520px", margin: "0 auto", backgroundColor: "#ffffff", border: `1px solid ${BRAND.border}`, borderRadius: "10px", overflow: "hidden" }}>
          <Section style={{ backgroundColor: BRAND.navy, padding: "18px 24px" }}>
            <Text style={{ margin: "0", fontSize: "24px", fontWeight: "800", fontStyle: "italic", color: "#ffffff", letterSpacing: "0.5px" }}>
              7M<span style={{ color: BRAND.blue }}>BET</span>
            </Text>
          </Section>
          <Section style={{ padding: "28px 24px" }}>{children}</Section>
          <Section style={{ borderTop: `1px solid ${BRAND.border}`, padding: "16px 24px", backgroundColor: "#fafafa" }}>
            <Text style={{ margin: "0", fontSize: "12px", color: BRAND.muted, lineHeight: "1.6" }}>
              Você recebe este e-mail porque tem uma conta no 7MBET. Ele é enviado automaticamente e não precisa de resposta.
            </Text>
            <Text style={{ margin: "8px 0 0", fontSize: "12px", color: BRAND.muted, lineHeight: "1.6" }}>
              <a href={SITE_URL} style={{ color: BRAND.blue, textDecoration: "none" }}>
                Abrir o 7MBET
              </a>{" "}
              · Apostas em créditos do site, sem dinheiro real.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
