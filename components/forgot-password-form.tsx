"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M3.75 5.625h12.5v8.75H3.75z" stroke="currentColor" strokeWidth="1.6" rx="2" />
      <path d="m4.375 6.25 5.625 4.375 5.625-4.375" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 10.1 8.85 12.45 13.6 7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="auth-success-state">
        <div className="auth-success-icon" aria-hidden="true">
          <SuccessIcon />
        </div>
        <div>
          <strong>E-mail enviado!</strong>
          <p>Verifique sua caixa de entrada e siga as instruções para recuperar o acesso.</p>
        </div>
        <Link href="/login" className="auth-inline-link">
          Voltar para o login
        </Link>
      </div>
    );
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

      <button className="auth-submit-button" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Enviando..." : "Enviar instruções"}
      </button>

      <div className="auth-inline-center">
        <Link href="/login" className="auth-inline-link">
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}
