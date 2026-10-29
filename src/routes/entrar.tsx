import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — 7MBET" },
      { name: "description", content: "Acesse sua conta na 7MBET." },
      { property: "og:title", content: "Entrar — 7MBET" },
      { property: "og:description", content: "Acesse sua conta na 7MBET." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
