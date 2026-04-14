"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Falha ao criar conta.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Nome da empresa</span>
        <input
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-violet-500"
          placeholder="Minha empresa"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Seu nome</span>
        <input
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-violet-500"
          placeholder="Seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
        <input
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-violet-500"
          placeholder="voce@empresa.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Senha</span>
        <input
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-violet-500"
          type="password"
          placeholder="Crie uma senha forte"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Confirmar senha</span>
        <input
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-violet-500"
          type="password"
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-slate-400">
        <input
          className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-violet-600"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />
        <span>
          Concordo com os{" "}
          <a className="text-violet-400 transition hover:text-violet-300" href="/terms">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a className="text-violet-400 transition hover:text-violet-300" href="/privacy">
            Política de Privacidade
          </a>
          .
        </span>
      </label>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Criando conta..." : "Criar conta e começar"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Já tem conta?{" "}
        <a className="text-violet-400 transition hover:text-violet-300" href="/login">
          Entrar
        </a>
      </p>
    </form>
  );
}
