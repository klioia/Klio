import { RegisterForm } from "@/components/register-form";
import { Topbar } from "@/components/topbar";

export default function RegisterPage() {
  return (
    <>
      <Topbar />
      <main className="section">
        <div className="shell" style={{ maxWidth: 640 }}>
          <section className="card panel auth-card">
            <span className="eyebrow">Onboarding</span>
            <h1 className="section-title">Ative sua operacao na Klio.</h1>
            <p className="muted">
              Este onboarding cria a empresa, o tenant e o administrador inicial para ligar bots, fluxos e webhooks.
            </p>
            <RegisterForm />
          </section>
        </div>
      </main>
    </>
  );
}
