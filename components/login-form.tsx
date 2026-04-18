"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M3.75 5.625h12.5v8.75H3.75z" stroke="currentColor" strokeWidth="1.6" rx="2" />
      <path d="m4.375 6.25 5.625 4.375 5.625-4.375" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M5.625 9.375h8.75v6.25h-8.75z" stroke="currentColor" strokeWidth="1.6" rx="2" />
      <path d="M7.5 9.375V7.5a2.5 2.5 0 1 1 5 0v1.875" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        d="M2.5 10s2.727-4.375 7.5-4.375S17.5 10 17.5 10 14.773 14.375 10 14.375 2.5 10 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        d="M3.125 3.125 16.875 16.875M8.41 5.82A8.26 8.26 0 0 1 10 5.625c4.773 0 7.5 4.375 7.5 4.375a13.91 13.91 0 0 1-2.781 3.14M11.96 12.01A3.125 3.125 0 0 1 7.99 8.04M5.398 5.399C3.594 6.411 2.5 8.125 2.5 8.125S5.227 12.5 10 12.5c.457 0 .895-.04 1.313-.115"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
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
      setError(data.error ?? "Falha ao entrar.");
      setLoading(false);
      return;
    }

    window.location.assign("/dashboard");
  }

  function handleGoogleLogin() {
    setError("Não foi possível conectar com o Google. Tente novamente.");
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form-stack">
      <label className="auth-field">
        <span className="auth-label">Email</span>
        <div className="auth-input-shell">
          <span className="auth-input-icon" aria-hidden="true">
            <MailIcon />
          </span>
          <input
            className="auth-input"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </label>

      <label className="auth-field">
        <span className="auth-label">Senha</span>
        <div className="auth-input-shell">
          <span className="auth-input-icon" aria-hidden="true">
            <LockIcon />
          </span>
          <input
            className="auth-input auth-input-with-action"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            className="auth-input-action"
            type="button"
            onClick={() => setShowPassword((state) => !state)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </label>

      <div className="auth-inline-action">
        <Link href="/forgot-password">Esqueci minha senha</Link>
      </div>

      {error ? <p className="auth-feedback auth-feedback-error">{error}</p> : null}

      <button className="auth-submit-button" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <div className="auth-divider-line">
        <span>ou continue com</span>
      </div>

      <button className="auth-google-button" type="button" onClick={handleGoogleLogin}>
        {googleIcon}
        <span>Continuar com Google</span>
      </button>

      <p className="auth-footer-copy">
        Não tem conta?{" "}
        <Link href="/register">Criar conta grátis</Link>
      </p>

      {loading ? (
        <div className="auth-loading-screen" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <strong>Entrando na sua operação...</strong>
        </div>
      ) : null}
    </form>
  );
}
