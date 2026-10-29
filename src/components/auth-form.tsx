import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Logo } from "@/components/site";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const input = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";

function translate(msg: string) {
  if (/invalid login/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (/already registered/i.test(msg)) return "Este e-mail já tem conta. Faça login.";
  if (/weak|easy to guess/i.test(msg)) return "Senha muito fraca. Escolha uma senha mais forte.";
  if (/password/i.test(msg) && /at least/i.test(msg)) return "A senha precisa ter pelo menos 6 caracteres.";
  return msg;
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { user } = useStore();
  const navigate = useNavigate();
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  if (user)
    return (
      <Layout>
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 text-center">
          <p className="mb-4">Você está conectado como <b>{user}</b>.</p>
          <button onClick={() => supabase.auth.signOut()} className="rounded-md bg-navy px-5 py-2.5 font-semibold text-navy-foreground">Sair</button>
        </div>
      </Layout>
    );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (mode === "signup" && pass !== pass2) return setErr("As senhas não coincidem.");
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      setBusy(false);
      if (error) return setErr(translate(error.message));
      navigate({ to: "/" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password: pass,
        options: { emailRedirectTo: window.location.origin, data: { nickname: nick.trim() || undefined } },
      });
      setBusy(false);
      if (error) return setErr(translate(error.message));
      if (data.session) navigate({ to: "/" });
      else setInfo("Conta criada! Enviamos um link de confirmação para o seu e-mail.");
    }
  }

  async function google() {
    setErr("");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) return setErr("Não foi possível entrar com Google.");
    if (r.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="bg-navy px-6 py-6 text-center">
          <Logo className="text-3xl" />
          <p className="mt-2 text-sm text-navy-muted">{mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}</p>
        </div>
        <form className="space-y-3 p-6" onSubmit={submit}>
          {mode === "signup" && <input className={input} placeholder="Apelido (opcional)" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} />}
          <input className={input} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className={input} type="password" required minLength={6} placeholder="Senha" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
          {mode === "signup" && <input className={input} type="password" required placeholder="Confirmar senha" value={pass2} onChange={(e) => setPass2(e.target.value)} autoComplete="new-password" />}
          {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
          {info && <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">{info}</p>}
          <button disabled={busy} className="h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
          <button type="button" onClick={google} className="h-11 w-full rounded-md border border-input bg-background font-semibold hover:bg-muted">
            Continuar com Google
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? <>Não tem conta? <Link to="/cadastrar" className="font-semibold text-primary">Cadastre-se</Link></>
              : <>Já tem conta? <Link to="/entrar" className="font-semibold text-primary">Entrar</Link></>}
          </p>
        </form>
      </div>
    </Layout>
  );
}
