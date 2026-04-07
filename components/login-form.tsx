"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@klio.local");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Email</span>
        <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label style={{ display: "block", marginTop: 18 }}>
        <span className="mini">Senha</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? <p className="mini" style={{ color: "#ff9cab", marginTop: 16 }}>{error}</p> : null}
      <div className="cta-row" style={{ marginTop: 20 }}>
        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
      <p className="mini" style={{ marginTop: 18 }}>
        Ambiente demo: admin@klio.local / 123456
      </p>
    </form>
  );
}
