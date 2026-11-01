import { Heading, Hr, Section, Text } from "@react-email/components";
import { BRAND, EmailLayout } from "./layout";

export function BanEmail({ name, reason }: { name: string; reason: string }) {
  return (
    <EmailLayout preview="Sua conta no 7MBET foi suspensa">
      <Section style={{ borderLeft: `4px solid ${BRAND.danger}`, padding: "0 0 0 14px", marginBottom: "18px" }}>
        <Heading style={{ margin: "0 0 10px", fontSize: "21px", color: BRAND.text, fontWeight: "800" }}>
          Conta suspensa
        </Heading>
        <Text style={{ margin: "0", fontSize: "15px", color: BRAND.text, lineHeight: "1.7" }}>
          Oi, {name}. O acesso da sua conta no <b>7MBET</b> foi suspenso.
        </Text>
      </Section>
      <Section style={{ border: `1px solid ${BRAND.border}`, borderRadius: "8px", padding: "16px 18px" }}>
        <Text style={{ margin: "0 0 6px", fontSize: "13px", color: BRAND.muted }}>Motivo</Text>
        <Text style={{ margin: "0", fontSize: "15px", color: BRAND.text, lineHeight: "1.7" }}>{reason}</Text>
      </Section>
      <Hr style={{ border: "none", borderTop: `1px solid ${BRAND.border}`, margin: "20px 0" }} />
      <Text style={{ margin: "0 0 10px", fontSize: "15px", color: BRAND.text, lineHeight: "1.7" }}>
        Nenhuma aposta nova pode ser feita enquanto a suspensão estiver ativa. Suas apostas já registradas continuam no
        histórico da conta.
      </Text>
      <Text style={{ margin: "0", fontSize: "15px", color: BRAND.muted, lineHeight: "1.7" }}>
        Se você acredita que houve um erro, fale com a nossa equipe pela página inicial do site.
      </Text>
    </EmailLayout>
  );
}
