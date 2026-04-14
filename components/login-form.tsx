"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const googleIcon = (
  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M21.805 10.023H12.24v3.955h5.482c-.236 1.271-.965 2.348-2.06 3.068v2.549h3.335c1.953-1.799 3.078-4.45 3.078-7.572 0-.67-.06-1.31-.17-1.999Z"
      fill="#4285F4"
    />
    <path
      d="M12.24 22c2.79 0 5.132-.925 6.842-2.508l-3.335-2.549c-.926.62-2.112.986-3.507.986-2.698 0-4.984-1.821-5.802-4.271H3.002v2.629A10.33 10.33 0 0 0 12.24 22Z"
      fill="#34A853"
    />
    <path
      d="M6.438 13.658a6.205 6.205 0 0 1-.324-1.958c0-.68.118-1.34.324-1.958V7.113H3.002A10.33 10.33 0 0 0 1.92 11.7c0 1.65.397 3.21 1.082 4.587l3.436-2.629Z"
      fill="#FBBC05"
    />
    <path
      d="M12.24 5.47c1.518 0 2.881.522 3.953 1.547l2.963-2.963C17.367 2.387 15.026 1.4 12.24 1.4 8.21 1.4 4.743 3.71 3.002 7.113l3.436 2.629C7.256 7.291 9.542 5.47 12.24 5.47Z"
      fill="#EA4335"
    />
  </svg>
);

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Falha no login.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">✉</span>
          <input
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 pl-11 pr-4 text-white outline-none transition focus:border-violet-500"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Senha</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">•</span>
          <input
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 pl-11 pr-20 text-white outline-none transition focus:border-violet-500"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-violet-400 transition hover:text-violet-300"
            type="button"
            onClick={() => setShowPassword((state) => !state)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </label>

      <div className="flex justify-end">
        <a className="text-sm text-violet-400 transition hover:text-violet-300" href="/forgot-password">
          Esqueci minha senha
        </a>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">ou continue com</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-transparent font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800/40"
        type="button"
      >
        {googleIcon}
        Continuar com Google
      </button>

      <p className="text-center text-sm text-slate-400">
        Não tem conta?{" "}
        <a className="text-violet-400 transition hover:text-violet-300" href="/register">
          Criar conta grátis
        </a>
      </p>
    </form>
  );
}
