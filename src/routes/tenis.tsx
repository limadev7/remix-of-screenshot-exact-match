import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/tenis")({
  head: () => ({
    meta: [
      { title: "Tênis — 7MBET" },
      { name: "description", content: "Partidas de tênis com odds e resultados." },
      { property: "og:title", content: "Tênis — 7MBET" },
      { property: "og:description", content: "Partidas de tênis com odds e resultados." },
    ],
  }),
  component: () => <SportPage sport="tenis" />,
});
