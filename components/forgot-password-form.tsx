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
      <div className="space-y-5 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-[badgePulse_2.6s_ease-in-out_infinite]">
          ✓
        </div>
        <div>
          <strong className="block text-lg text-white">E-mail enviado!</strong>
          <p className="mt-2 text-sm text-slate-400">Verifique sua caixa de entrada.</p>
        </div>
        <a className="inline-flex text-sm text-violet-400 transition hover:text-violet-300" href="/login">
          Voltar para o login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
        {loading ? "Enviando..." : "Enviar instruções"}
      </button>

      <div className="text-center">
        <a className="text-sm text-violet-400 transition hover:text-violet-300" href="/login">
          Voltar para o login
        </a>
      </div>
    </form>
  );
}
