import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — 7MBET (demo)" },
      { name: "description", content: "Login demonstrativo da 7MBET, sem coleta de dados." },
      { property: "og:title", content: "Entrar — 7MBET" },
      { property: "og:description", content: "Login demonstrativo, sem coleta de dados." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
