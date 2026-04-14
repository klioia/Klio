import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Recuperar acesso",
  description: "Digite seu e-mail e receba instruções para recuperar o acesso à sua conta Klio.",
  openGraph: {
    title: "Recuperar acesso",
    description: "Digite seu e-mail e receba instruções para recuperar o acesso à sua conta Klio.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Recuperar acesso",
    description: "Digite seu e-mail e receba instruções para recuperar o acesso à sua conta Klio.",
    images: ["/logo.png"]
  }
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Topbar compactAuth />
      <main className="min-h-[calc(100svh-76px)] bg-slate-950 px-4 py-8 md:px-8">
        <div className="mx-auto flex min-h-[calc(100svh-140px)] w-full max-w-xl items-center justify-center">
          <section className="w-full rounded-[28px] border border-slate-800 bg-[#0f172a] p-8 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
            <div className="mb-8 flex items-center gap-3">
              <img src="/logo.png" alt="Klio" className="h-10 w-10 rounded-2xl" />
              <div>
                <div className="text-lg font-semibold text-white">Klio</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Recuperação</div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Recuperar acesso</h1>
              <p className="mt-2 text-sm text-slate-400">
                Digite seu e-mail e enviaremos as instruções de recuperação.
              </p>
            </div>

            <ForgotPasswordForm />
          </section>
        </div>
      </main>
    </>
  );
}
