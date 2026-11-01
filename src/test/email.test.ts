import { describe, expect, it } from "vitest";
import { renderTemplate, subjectOf, TEMPLATES } from "@/email";

// O renderizador do React Email separa trechos de texto com comentários HTML.
const text = (html: string) => html.replace(/<!--\s*-->/g, "");

describe("templates de e-mail", () => {
  it("boas-vindas traz o nome, os créditos iniciais e o link do site", async () => {
    const html = text(await renderTemplate("welcome", { name: "Ana" }));
    expect(html).toContain("Bem-vindo, Ana");
    expect(html).toContain("1000 créditos");
    expect(html).toContain("pixel-perfect-picture-maker-35.lovable.app");
    expect(subjectOf("welcome", { name: "Ana" })).toContain("Ana");
  });

  it("boas-vindas não deixa código de um nome chegar como HTML", async () => {
    const html = await renderTemplate("welcome", { name: "<b>x</b>" });
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;");
  });

  it("depósito mostra o valor adicionado e o saldo", async () => {
    const html = text(await renderTemplate("deposit", { name: "Ana", amount: 250, balance: 900 }));
    expect(html).toContain("Depósito confirmado");
    expect(html).toContain("+250");
    expect(html).toContain("900");
    expect(subjectOf("deposit", { name: "Ana", amount: 250, balance: 900 })).toContain("250");
  });

  it("banimento mostra o motivo informado", async () => {
    const html = text(await renderTemplate("ban", { name: "Ana", reason: "Uso de conta de terceiros" }));
    expect(html).toContain("Conta suspensa");
    expect(html).toContain("Uso de conta de terceiros");
  });

  it("todos os templates têm título e assunto próprios", () => {
    for (const name of Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]) {
      expect(TEMPLATES[name].label.length).toBeGreaterThan(3);
    }
  });
});
