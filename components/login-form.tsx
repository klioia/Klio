"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSubmit} className="auth-form">
      <label className="field">
        <span className="mini">Email</span>
        <div className="input-wrap">
          <span className="input-icon">✉</span>
          <input
            className="input"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
      </label>
      <label className="field">
        <span className="mini">Senha</span>
        <div className="input-wrap">
          <span className="input-icon">🔒</span>
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="input-action"
            type="button"
            onClick={() => setShowPassword((state) => !state)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </label>
      <div className="auth-meta">
        <a className="mini" href="/forgot-password">
          Esqueci minha senha
        </a>
      </div>
      {error ? <p className="mini auth-error">{error}</p> : null}
      <button className="btn btn-primary btn-full" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <div className="auth-divider">
        <span>ou continue com</span>
      </div>
      <button className="btn btn-secondary btn-full" type="button">
        <span className="google-icon">G</span>
        Continuar com Google
      </button>
      <p className="mini auth-footer">
        Não tem conta? <a href="/register">Criar conta grátis</a>
      </p>
    </form>
  );
}
