import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/cadastrar")({
  head: () => ({
    meta: [
      { title: "Cadastrar — 7MBET" },
      { name: "description", content: "Crie sua conta na 7MBET." },
      { property: "og:title", content: "Cadastrar — 7MBET" },
      { property: "og:description", content: "Crie sua conta na 7MBET." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
