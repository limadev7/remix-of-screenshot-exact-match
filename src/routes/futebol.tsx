import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/futebol")({
  head: () => ({
    meta: [
      { title: "Futebol — 7MBET" },
      { name: "description", content: "Partidas de futebol com odds e filtros." },
      { property: "og:title", content: "Futebol — 7MBET" },
      { property: "og:description", content: "Partidas de futebol com odds e resultados." },
    ],
  }),
  component: () => <SportPage sport="futebol" />,
});
