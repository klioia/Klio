import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Recupere o acesso à sua conta Klio."
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Topbar />
      <main className="auth-page">
        <div className="shell" style={{ maxWidth: 520 }}>
          <section className="card panel auth-card auth-panel">
            <div className="auth-panel-head">
              <span className="eyebrow">Recuperação</span>
              <h1 className="section-title">Esqueceu sua senha?</h1>
              <p className="muted">Envie seu e-mail e vamos te ajudar a recuperar o acesso.</p>
            </div>
            <ForgotPasswordForm />
          </section>
        </div>
      </main>
    </>
  );
}
