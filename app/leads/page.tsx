import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { LeadRecord, listLeads } from "@/lib/repositories";

function leadTags(lead: LeadRecord) {
  const tags = [lead.channel, lead.stage];
  if (/orcamento|preco|valor|proposta/i.test(lead.lastMessage)) tags.push("intenção comercial");
  if (/clinica|studio|empresa/i.test(`${lead.email} ${lead.lastMessage}`)) tags.push("B2B");
  return tags.slice(0, 4);
}

export default async function LeadsPage() {
  const session = await requireSession();
  const leads = (await listLeads(session.id)) as LeadRecord[];

  return (
    <AppShell
      userName={session.name}
      title="CRM de contatos"
      description="Perfil do lead, origem, etapa do funil, histórico recente, tags e contexto para repasse humano."
    >
      <section className="crm-console">
        <div className="crm-header">
          <div>
            <span className="workspace-kicker">CRM leve</span>
            <h2>Contatos prontos para atendimento e automação.</h2>
            <p>Use esta visão para entender quem entrou, de onde veio e qual deve ser o próximo passo.</p>
          </div>
          <div className="crm-summary">
            <div>
              <span>Total</span>
              <strong>{leads.length}</strong>
            </div>
            <div>
              <span>Qualificados</span>
              <strong>{leads.filter((lead) => /qualifica|proposta|negocia|fech/i.test(lead.stage)).length}</strong>
            </div>
          </div>
        </div>

        {leads.length ? (
          <div className="crm-grid">
            {leads.map((lead) => (
              <article className="crm-card" key={lead.id}>
                <header>
                  <div>
                    <strong>{lead.name}</strong>
                    <span>{lead.email}</span>
                  </div>
                  <span className="tag tag-success">{lead.stage}</span>
                </header>
                <p>{lead.lastMessage}</p>
                <div className="crm-tags">
                  {leadTags(lead).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="crm-meta">
                  <div>
                    <span>Telefone</span>
                    <strong>{lead.phone || "Não informado"}</strong>
                  </div>
                  <div>
                    <span>Responsável</span>
                    <strong>{session.name}</strong>
                  </div>
                  <div>
                    <span>Última interação</span>
                    <strong>{new Date(lead.updatedAt).toLocaleString("pt-BR")}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="execution-empty">
            <span className="workspace-kicker">CRM vazio</span>
            <h3>Nenhum contato capturado ainda.</h3>
            <p>Conecte WhatsApp ou Instagram e rode um fluxo para começar a formar sua base de leads.</p>
          </section>
        )}
      </section>
    </AppShell>
  );
}
