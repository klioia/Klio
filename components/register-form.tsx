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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
      setError("Aceite os termos para continuar.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        name,
        email,
        password
      })
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
    <form onSubmit={handleSubmit} className="auth-form">
      <label className="field">
        <span className="mini">Nome da empresa</span>
        <div className="input-wrap">
          <span className="input-icon">🏢</span>
          <input
            className="input"
            placeholder="Minha Empresa"
            onChange={(event) => setCompany(event.target.value)}
            value={company}
            required
          />
        </div>
      </label>
      <label className="field">
        <span className="mini">Nome do admin</span>
        <div className="input-wrap">
          <span className="input-icon">👤</span>
          <input
            className="input"
            placeholder="Seu nome"
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
        </div>
      </label>
      <label className="field">
        <span className="mini">Email</span>
        <div className="input-wrap">
          <span className="input-icon">✉</span>
          <input
            className="input"
            placeholder="voce@empresa.com"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
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
            type="password"
            placeholder="Crie uma senha forte"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            required
          />
        </div>
      </label>
      <label className="field">
        <span className="mini">Confirmar senha</span>
        <div className="input-wrap">
          <span className="input-icon">🔁</span>
          <input
            className="input"
            type="password"
            placeholder="Repita sua senha"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            required
          />
        </div>
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
        />
        <span>Li e concordo com os termos e a política de privacidade.</span>
      </label>
      {error ? <p className="mini auth-error">{error}</p> : null}
      <button className="btn btn-primary btn-full" disabled={loading} type="submit">
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Criando..." : "Ativar workspace"}
      </button>
      <p className="mini auth-footer">
        Já tem conta? <a href="/login">Entrar na Klio</a>
      </p>
    </form>
  );
}
