import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { listLeads } from "@/lib/repositories";

type Lead = {
  id: string;
  name: string;
  channel: string;
  stage: string;
  email: string;
  phone: string;
  lastMessage: string;
  updatedAt: string;
};

export default async function LeadsPage() {
  const session = await requireSession();
  const leads = await listLeads(session.id);

  return (
    <AppShell
      userName={session.name}
      title="Leads e conversas"
      description="Acompanhe origem, etapa do funil, dados de contato e o último contexto de cada oportunidade."
    >
      {(leads as Lead[]).length ? (
        <div className="lead-grid">
          {(leads as Lead[]).map((lead) => (
            <article className="card panel lead-card" key={lead.id}>
              <div className="flow-item">
                <div>
                  <strong>{lead.name}</strong>
                  <div className="mini">
                    {lead.channel} · {lead.email}
                  </div>
                </div>
                <span className="tag tag-success">{lead.stage}</span>
              </div>

              <p className="muted" style={{ marginTop: 16 }}>
                {lead.lastMessage}
              </p>

              <div className="lead-meta-grid">
                <div className="builder-summary-card">
                  <span className="mini">Telefone</span>
                  <strong>{lead.phone}</strong>
                </div>
                <div className="builder-summary-card">
                  <span className="mini">Última atualização</span>
                  <strong>{new Date(lead.updatedAt).toLocaleString("pt-BR")}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="card panel builder-empty-state">
          <strong>Nenhum lead encontrado</strong>
          <p className="mini">Assim que os canais começarem a receber mensagens, os contatos aparecerão aqui.</p>
        </section>
      )}
    </AppShell>
  );
}
