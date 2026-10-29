import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/basquete")({
  head: () => ({
    meta: [
      { title: "Basquete — 7MBET (simulação)" },
      { name: "description", content: "Jogos de basquete fictícios com odds demonstrativas." },
      { property: "og:title", content: "Basquete — 7MBET" },
      { property: "og:description", content: "Jogos de basquete fictícios com odds demonstrativas." },
    ],
  }),
  component: () => <SportPage sport="basquete" />,
});
