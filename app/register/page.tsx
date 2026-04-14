import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Criar conta grátis",
  description: "Crie sua conta grátis na Klio e comece a automatizar seu atendimento sem cartão de crédito.",
  openGraph: {
    title: "Criar conta grátis",
    description: "Crie sua conta grátis na Klio e comece a automatizar seu atendimento sem cartão de crédito.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criar conta grátis",
    description: "Crie sua conta grátis na Klio e comece a automatizar seu atendimento sem cartão de crédito.",
    images: ["/logo.png"]
  }
};

const benefits = [
  "Configure em menos de 5 minutos",
  "Teste grátis por 7 dias",
  "Cancele quando quiser",
  "Suporte incluído"
];

export default function RegisterPage() {
  return (
    <>
      <Topbar compactAuth />
      <main className="min-h-[calc(100svh-76px)] bg-slate-950 px-4 py-8 md:px-8">
        <div className="mx-auto grid min-h-[calc(100svh-140px)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-[0_30px_120px_rgba(2,6,23,0.45)] md:grid-cols-[1.05fr_0.95fr]">
          <aside className="hidden bg-[linear-gradient(180deg,#1e1b4b_0%,#0f0a1e_100%)] p-12 md:flex md:flex-col md:justify-between">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
                  <img src="/logo.png" alt="Klio" className="h-14 w-14 rounded-2xl" />
                </div>
                <div>
                  <div className="text-3xl font-semibold text-white">Klio</div>
                  <div className="text-sm uppercase tracking-[0.24em] text-violet-200/70">Automação conversacional</div>
                </div>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-md text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                  Comece a automatizar hoje.
                </h1>
                <div className="space-y-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 text-sm text-violet-100/85">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm leading-7 text-slate-200/85">
                Ative sua conta, conecte seus canais e publique o primeiro fluxo sem depender de configuração técnica.
              </p>
            </div>
          </aside>

          <section className="flex items-center justify-center bg-slate-900 px-4 py-8 md:px-10">
            <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0f172a] p-8 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
              <div className="mb-8 flex items-center gap-3">
                <img src="/logo.png" alt="Klio" className="h-10 w-10 rounded-2xl" />
                <div>
                  <div className="text-lg font-semibold text-white">Klio</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Criação de conta</div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Crie sua conta grátis</h2>
                <p className="mt-2 text-sm text-slate-400">Sem cartão de crédito. Cancele quando quiser.</p>
              </div>

              <RegisterForm />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
