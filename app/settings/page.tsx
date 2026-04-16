import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";

const settingsGroups = [
  {
    title: "Workspace",
    items: ["Nome da empresa", "Branding da Klio", "Domínio de atendimento", "Idioma e fuso horário"]
  },
  {
    title: "Equipe e permissões",
    items: ["Owner", "Admin", "Editor de fluxos", "Atendente", "Somente leitura"]
  },
  {
    title: "Segurança",
    items: ["Credenciais ocultas", "Sessões protegidas", "Auditoria de alterações", "2FA para administradores"]
  },
  {
    title: "Plano e faturamento",
    items: ["Plano atual", "Uso de mensagens", "Limites por canal", "Upgrade assistido"]
  }
];

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <AppShell
      userName={session.name}
      title="Configurações"
      description="Centralize workspace, membros, permissões, segurança e limites da operação Klio."
    >
      <section className="settings-console">
        <div className="settings-hero">
          <span className="workspace-kicker">Administração</span>
          <h2>Base segura para operar automações em equipe.</h2>
          <p>Esta área organiza as configurações essenciais do SaaS e prepara o produto para times, permissões e governança.</p>
        </div>

        <div className="settings-grid">
          {settingsGroups.map((group) => (
            <article className="settings-card" key={group.title}>
              <strong>{group.title}</strong>
              <div className="settings-list">
                {group.items.map((item) => (
                  <div key={item}>
                    <span className="settings-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
