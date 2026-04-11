import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua operação Klio."
};

export default function LoginPage() {
  return (
    <>
      <Topbar />
      <main className="auth-page">
        <div className="auth-layout">
          <aside className="auth-aside">
            <div className="auth-aside-content">
              <span className="eyebrow">Klio Flow</span>
              <h1 className="auth-title">Atendimento automático que parece humano.</h1>
              <p className="muted">
                Centralize WhatsApp e Instagram em um painel que responde, qualifica e repassa no tempo certo.
              </p>
              <div className="auth-quote">
                <div className="auth-quote-stars">★★★★★</div>
                <p>
                  “A Klio reduziu nosso tempo de resposta em minutos e deixou o time focado nas vendas.”
                </p>
                <div className="auth-quote-profile">
                  <span className="avatar">LM</span>
                  <div>
                    <strong>Larissa Moura</strong>
                    <span className="mini">Gestora Comercial</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <section className="auth-panel card panel auth-card">
            <div className="auth-panel-head">
              <Brand compact />
              <span className="eyebrow">Área segura</span>
              <h2 className="section-title">Bem-vindo de volta</h2>
              <p className="muted">Acesse sua operação Klio</p>
            </div>
            <LoginForm />
          </section>
        </div>
      </main>
    </>
  );
}
