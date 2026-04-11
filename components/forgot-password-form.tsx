"use client";

import { FormEvent, useState } from "react";

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
      <div className="auth-success">
        <div className="success-icon">✓</div>
        <strong>Confira seu e-mail</strong>
        <p className="mini">Se houver uma conta com esse endereço, enviamos as instruções de recuperação.</p>
        <a className="btn btn-secondary" href="/login">
          Voltar ao login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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
      <button className="btn btn-primary btn-full" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </button>
    </form>
  );
}
