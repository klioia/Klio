import type { Metadata } from "next";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Leia os Termos de Uso da Klio para entender as regras básicas de acesso e utilização da plataforma.",
  openGraph: {
    title: "Termos de Uso",
    description: "Leia os Termos de Uso da Klio para entender as regras básicas de acesso e utilização da plataforma.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Termos de Uso",
    description: "Leia os Termos de Uso da Klio para entender as regras básicas de acesso e utilização da plataforma.",
    images: ["/logo.png"]
  }
};

export default function TermsPage() {
  return (
    <>
      <Topbar compactAuth />
      <main className="section">
        <div className="shell" style={{ maxWidth: 860 }}>
          <section className="card panel auth-card">
            <span className="eyebrow">Termos</span>
            <h1 className="section-title">Termos de Uso</h1>
            <div className="flow-list" style={{ marginTop: 20 }}>
              <p className="muted">
                Ao usar a Klio, você concorda em utilizar a plataforma de forma legítima, respeitando as regras de
                comunicação dos canais conectados e a legislação aplicável.
              </p>
              <p className="muted">
                Você é responsável pelos acessos da sua conta, pelas mensagens enviadas a partir da sua operação e
                pelas informações cadastradas no ambiente.
              </p>
              <p className="muted">
                A Klio pode atualizar estes termos para refletir melhorias de produto, questões de segurança ou
                exigências legais. Em caso de mudanças relevantes, vamos comunicar isso com clareza.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
