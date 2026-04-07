import { LoginForm } from "@/components/login-form";
import { Topbar } from "@/components/topbar";

export default function LoginPage() {
  return (
    <>
      <Topbar />
      <main className="section">
        <div className="shell" style={{ maxWidth: 560 }}>
          <section className="card panel auth-card">
            <span className="eyebrow">Acesso interno</span>
            <h1 className="section-title">Entre no centro de controle da Klio.</h1>
            <p className="muted">
              Acesse seus bots, fluxos, execucoes e integracoes em um workspace mais tecnico, limpo e pronto para operacao.
            </p>
            <LoginForm />
            <div className="divider" />
            <p className="mini">
              Ainda nao tem empresa? <a href="/register">Criar conta na Klio</a>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
