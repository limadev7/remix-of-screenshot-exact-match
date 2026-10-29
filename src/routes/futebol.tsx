import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/futebol")({
  head: () => ({
    meta: [
      { title: "Futebol — 7MBET (simulação)" },
      { name: "description", content: "Partidas de futebol fictícias com odds demonstrativas e filtros." },
      { property: "og:title", content: "Futebol — 7MBET" },
      { property: "og:description", content: "Partidas de futebol fictícias com odds demonstrativas." },
    ],
  }),
  component: () => <SportPage sport="futebol" />,
});
