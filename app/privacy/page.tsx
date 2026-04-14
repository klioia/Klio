import type { Metadata } from "next";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Entenda como a Klio coleta, usa e protege os dados da sua operação e dos seus contatos.",
  openGraph: {
    title: "Política de Privacidade",
    description: "Entenda como a Klio coleta, usa e protege os dados da sua operação e dos seus contatos.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Privacidade",
    description: "Entenda como a Klio coleta, usa e protege os dados da sua operação e dos seus contatos.",
    images: ["/logo.png"]
  }
};

export default function PrivacyPage() {
  return (
    <>
      <Topbar compactAuth />
      <main className="section">
        <div className="shell" style={{ maxWidth: 860 }}>
          <section className="card panel auth-card">
            <span className="eyebrow">Privacidade</span>
            <h1 className="section-title">Política de Privacidade</h1>
            <div className="flow-list" style={{ marginTop: 20 }}>
              <p className="muted">
                A Klio utiliza os dados da sua conta e das integrações conectadas para operar automações, exibir
                métricas e processar mensagens dentro da plataforma.
              </p>
              <p className="muted">
                Os dados são tratados com foco em segurança, controle de acesso e mínima exposição de informações
                sensíveis. Sempre que possível, credenciais ficam protegidas e ocultas na interface.
              </p>
              <p className="muted">
                Se você precisar revisar, atualizar ou remover dados da sua operação, pode entrar em contato pelos
                canais oficiais de suporte da Klio.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
