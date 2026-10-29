import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/cadastrar")({
  head: () => ({
    meta: [
      { title: "Cadastrar — 7MBET (demo)" },
      { name: "description", content: "Cadastro demonstrativo da 7MBET, sem coleta de dados." },
      { property: "og:title", content: "Cadastrar — 7MBET" },
      { property: "og:description", content: "Cadastro demonstrativo, sem coleta de dados." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
