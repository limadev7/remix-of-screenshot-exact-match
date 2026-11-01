import { render } from "@react-email/render";
import { BanEmail } from "./ban";
import { DepositEmail } from "./deposit";
import { WelcomeEmail } from "./welcome";

export type TemplateName = "welcome" | "deposit" | "ban";

export interface TemplateProps {
  welcome: { name: string };
  deposit: { name: string; amount: number; balance: number };
  ban: { name: string; reason: string };
}

type Entry<K extends TemplateName> = {
  label: string;
  subject: (props: TemplateProps[K]) => string;
  render: (props: TemplateProps[K]) => Promise<string>;
};

export const TEMPLATES: { [K in TemplateName]: Entry<K> } = {
  welcome: {
    label: "Boas-vindas",
    subject: ({ name }) => `Bem-vindo ao 7MBET, ${name}`,
    render: ({ name }) => render(<WelcomeEmail name={name} />),
  },
  deposit: {
    label: "Depósito de créditos",
    subject: ({ amount }) => `${amount.toLocaleString("pt-BR")} créditos adicionados à sua conta`,
    render: ({ name, amount, balance }) => render(<DepositEmail name={name} amount={amount} balance={balance} />),
  },
  ban: {
    label: "Conta suspensa",
    subject: () => "Aviso importante: sua conta no 7MBET foi suspensa",
    render: ({ name, reason }) => render(<BanEmail name={name} reason={reason} />),
  },
};

export function renderTemplate<K extends TemplateName>(name: K, props: TemplateProps[K]) {
  return TEMPLATES[name].render(props);
}

export function subjectOf<K extends TemplateName>(name: K, props: TemplateProps[K]) {
  return TEMPLATES[name].subject(props);
}
