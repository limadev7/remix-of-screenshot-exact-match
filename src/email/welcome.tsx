import { Button, Heading, Section, Text } from "@react-email/components";
import { BRAND, EmailLayout, SITE_URL, buttonStyle } from "./layout";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout preview="Sua conta no 7MBET está pronta">
      <Heading style={{ margin: "0 0 12px", fontSize: "21px", color: BRAND.text, fontWeight: "800" }}>
        Bem-vindo, {name}!
      </Heading>
      <Text style={{ margin: "0 0 14px", fontSize: "15px", color: BRAND.text, lineHeight: "1.7" }}>
        Sua conta no <b>7MBET</b> está pronta. Você começa com <b>1000 créditos</b> para usar nas partidas de futebol,
        basquete e tênis.
      </Text>
      <Text style={{ margin: "0 0 22px", fontSize: "15px", color: BRAND.muted, lineHeight: "1.7" }}>
        Monte seu cupom, escolha o valor e acompanhe o resultado quando o jogo terminar.
      </Text>
      <Section>
        <Button href={SITE_URL} style={buttonStyle()}>
          Entrar no 7MBET
        </Button>
      </Section>
      <Text style={{ margin: "22px 0 0", fontSize: "13px", color: BRAND.muted, lineHeight: "1.6" }}>
        Se não foi você quem criou esta conta, ignore este e-mail.
      </Text>
    </EmailLayout>
  );
}
