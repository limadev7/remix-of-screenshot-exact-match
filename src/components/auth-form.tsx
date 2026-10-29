import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Logo } from "@/components/site";
import { useStore } from "@/lib/store";

const input = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const [nick, setNick] = useState("");

  if (user && mode === "login")
    return (
      <Layout>
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 text-center">
          <p className="mb-4">Sessão demo ativa como <b>{user}</b>.</p>
          <button onClick={() => setUser(null)} className="rounded-md bg-navy px-5 py-2.5 font-semibold text-navy-foreground">Sair da sessão demo</button>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-navy px-6 py-6 text-center">
          <Logo className="text-3xl" />
          <p className="mt-2 text-sm text-navy-muted">{mode === "login" ? "Entrar na conta demonstrativa" : "Criar conta demonstrativa"}</p>
        </div>
        <form
          className="space-y-3 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            // Nenhuma senha é lida ou guardada: só um apelido de demonstração.
            setUser(nick.trim() || "Visitante");
            navigate({ to: "/" });
          }}
        >
          {mode === "signup" && <input className={input} placeholder="Apelido (opcional)" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} />}
          <input className={input} type="email" placeholder="E-mail" autoComplete="off" />
          <input className={input} type="password" placeholder="Senha" autoComplete="off" />
          {mode === "signup" && <input className={input} type="password" placeholder="Confirmar senha" autoComplete="off" />}
          <button className="h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground hover:opacity-90">
            {mode === "login" ? "Entrar (demo)" : "Cadastrar (demo)"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? <>Não tem conta? <Link to="/cadastrar" className="font-semibold text-primary">Cadastre-se</Link></>
              : <>Já tem conta? <Link to="/entrar" className="font-semibold text-primary">Entrar</Link></>}
          </p>
          <p className="rounded bg-accent px-3 py-2 text-xs text-accent-foreground">
            Login demonstrativo: nenhum e-mail ou senha é enviado ou armazenado.
          </p>
        </form>
      </div>
    </Layout>
  );
}
