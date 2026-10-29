import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/basquete")({
  head: () => ({
    meta: [
      { title: "Basquete — 7MBET" },
      { name: "description", content: "Jogos de basquete com odds e resultados." },
      { property: "og:title", content: "Basquete — 7MBET" },
      { property: "og:description", content: "Jogos de basquete com odds e resultados." },
    ],
  }),
  component: () => <SportPage sport="basquete" />,
});
