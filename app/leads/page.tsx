import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
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
    <>
      <Topbar />
      <AppShell
        userName={session.name}
        title="Seus leads centralizados."
        description="Aqui voce acompanha origem, etapa do funil e o ultimo contexto de cada conversa."
      >
        <div className="flow-list">
          {(leads as Lead[]).map((lead) => (
            <article className="card panel" key={lead.id}>
              <div className="flow-item">
                <div>
                  <strong>{lead.name}</strong>
                  <div className="mini">
                    {lead.channel} - {lead.email}
                  </div>
                </div>
                <span className="tag tag-success">{lead.stage}</span>
              </div>
              <p className="muted" style={{ marginTop: 16 }}>
                {lead.lastMessage}
              </p>
              <div className="chip-row" style={{ marginTop: 16 }}>
                <span className="tag tag-warning">{lead.phone}</span>
                <span className="tag tag-warning">{new Date(lead.updatedAt).toLocaleString("pt-BR")}</span>
              </div>
            </article>
          ))}
        </div>
      </AppShell>
    </>
  );
}
