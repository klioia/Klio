import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { RegisterForm } from "@/components/register-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta e comece a automatizar o atendimento com a Klio."
};

export default function RegisterPage() {
  return (
    <>
      <Topbar />
      <main className="auth-page">
        <div className="auth-layout">
          <aside className="auth-aside">
            <div className="auth-aside-content">
              <span className="eyebrow">Klio Flow</span>
              <h1 className="auth-title">Ative sua operação em minutos.</h1>
              <p className="muted">
                Configure, teste e coloque sua automação para trabalhar sem precisar montar uma equipe grande.
              </p>
              <div className="auth-benefits">
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  Configure em 5 minutos
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  Suporte incluído desde o início
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  Cancele quando quiser
                </div>
              </div>
            </div>
          </aside>
          <section className="auth-panel card panel auth-card">
            <div className="auth-panel-head">
              <Brand compact />
              <span className="eyebrow">Onboarding rápido</span>
              <h2 className="section-title">Crie sua conta</h2>
              <p className="muted">Crie sua conta e comece a automatizar o atendimento em menos de 5 minutos.</p>
            </div>
            <RegisterForm />
          </section>
        </div>
      </main>
    </>
  );
}
