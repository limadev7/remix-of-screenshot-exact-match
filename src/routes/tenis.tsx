import { createFileRoute } from "@tanstack/react-router";
import { SportPage } from "@/components/sport-page";

export const Route = createFileRoute("/tenis")({
  head: () => ({
    meta: [
      { title: "Tênis — 7MBET (simulação)" },
      { name: "description", content: "Partidas de tênis fictícias com odds demonstrativas." },
      { property: "og:title", content: "Tênis — 7MBET" },
      { property: "og:description", content: "Partidas de tênis fictícias com odds demonstrativas." },
    ],
  }),
  component: () => <SportPage sport="tenis" />,
});
