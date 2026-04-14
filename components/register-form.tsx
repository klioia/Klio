"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function BuildingIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M4.375 4.375h11.25v11.25H4.375z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 7.5h1.25v1.25H7.5zm3.75 0h1.25v1.25h-1.25zM7.5 11.25h1.25v1.25H7.5zm3.75 0h1.25v1.25h-1.25zM9.375 15.625v-2.5h1.25v2.5" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.875" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.625 15c.584-2.014 2.348-3.125 4.375-3.125S13.79 12.986 14.375 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <form onSubmit={handleSubmit} className="auth-form-stack">
      <label className="auth-field">
        <span className="auth-label">Nome da empresa</span>
        <div className="auth-input-shell">
          <span className="auth-input-icon" aria-hidden="true">
            <BuildingIcon />
          </span>
          <input
            className="auth-input"
            placeholder="Minha empresa"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            autoComplete="organization"
            required
          />
        </div>
      </label>

      <label className="auth-field">
        <span className="auth-label">Seu nome</span>
        <div className="auth-input-shell">
          <span className="auth-input-icon" aria-hidden="true">
            <UserIcon />
          </span>
          <input
            className="auth-input"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>
      </label>

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
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
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

      <label className="auth-field">
        <span className="auth-label">Confirmar senha</span>
        <div className="auth-input-shell">
          <span className="auth-input-icon" aria-hidden="true">
            <LockIcon />
          </span>
          <input
            className="auth-input auth-input-with-action"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repita sua senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            className="auth-input-action"
            type="button"
            onClick={() => setShowConfirmPassword((state) => !state)}
            aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>
      </label>

      <label className="auth-checkbox-row">
        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
        <span>
          Concordo com os <Link href="/terms">Termos de Uso</Link> e com a <Link href="/privacy">Política de Privacidade</Link>.
        </span>
      </label>

      <p className="auth-helper-copy">
        Crie sua conta e comece a automatizar o atendimento em menos de 5 minutos.
      </p>

      {error ? <p className="auth-feedback auth-feedback-error">{error}</p> : null}

      <button className="auth-submit-button" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Criando conta..." : "Criar conta e começar"}
      </button>

      <p className="auth-footer-copy">
        Já tem conta?{" "}
        <Link href="/login">
          Entrar
        </Link>
      </p>
    </form>
  );
}
