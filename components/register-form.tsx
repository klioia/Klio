"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

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
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Empresa</span>
        <input
          className="input"
          placeholder="Minha Empresa"
          onChange={(event) => setCompany(event.target.value)}
          value={company}
        />
      </label>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Nome do admin</span>
        <input
          className="input"
          placeholder="Seu nome"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </label>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Email</span>
        <input
          className="input"
          placeholder="voce@empresa.com"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
      </label>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Senha</span>
        <input
          className="input"
          type="password"
          placeholder="Crie uma senha forte"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
      </label>
      {error ? <p className="mini" style={{ color: "#ff9cab", marginTop: 16 }}>{error}</p> : null}
      <div className="cta-row" style={{ marginTop: 20 }}>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Criando..." : "Ativar workspace"}
        </button>
      </div>
    </form>
  );
}
