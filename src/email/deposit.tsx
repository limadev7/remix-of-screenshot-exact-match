import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { BRAND, EmailLayout, SITE_URL, buttonStyle } from "./layout";

const money = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function DepositEmail({ name, amount, balance }: { name: string; amount: number; balance: number }) {
  return (
    <EmailLayout preview={`${money(amount)} créditos adicionados à sua conta`}>
      <Heading style={{ margin: "0 0 12px", fontSize: "21px", color: BRAND.text, fontWeight: "800" }}>
        Depósito confirmado
      </Heading>
      <Text style={{ margin: "0 0 18px", fontSize: "15px", color: BRAND.text, lineHeight: "1.7" }}>
        Oi, {name}. Seus créditos já estão disponíveis para apostar.
      </Text>
      <Section style={{ border: `1px solid ${BRAND.border}`, borderRadius: "8px", padding: "16px 18px", backgroundColor: "#fbfdff" }}>
        <Text style={{ margin: "0 0 6px", fontSize: "13px", color: BRAND.muted }}>Créditos adicionados</Text>
        <Text style={{ margin: "0 0 14px", fontSize: "28px", fontWeight: "800", color: BRAND.success }}>
          +{money(amount)}
        </Text>
        <Hr style={{ border: "none", borderTop: `1px solid ${BRAND.border}`, margin: "0 0 14px" }} />
        <Text style={{ margin: "0 0 6px", fontSize: "13px", color: BRAND.muted }}>Saldo atual</Text>
        <Text style={{ margin: "0", fontSize: "20px", fontWeight: "800", color: BRAND.navy }}>{money(balance)}</Text>
      </Section>
      <Section style={{ marginTop: "22px" }}>
        <Button href={SITE_URL} style={buttonStyle()}>
          Ver partidas
        </Button>
      </Section>
      <Text style={{ margin: "22px 0 0", fontSize: "13px", color: BRAND.muted, lineHeight: "1.6" }}>
        Se você não reconhece este depósito, acesse sua conta e troque a senha.
      </Text>
    </EmailLayout>
  );
}
