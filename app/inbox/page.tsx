import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { LeadRecord, listLeads } from "@/lib/repositories";

function channelTone(channel: string) {
  return channel.toLowerCase().includes("instagram") ? "tag tag-warning" : "tag tag-success";
}

export default async function InboxPage() {
  const session = await requireSession();
  const leads = (await listLeads(session.id)) as LeadRecord[];

  return (
    <AppShell
      userName={session.name}
      title="Inbox de atendimento"
      description="Organize conversas por canal, entenda o contexto do lead e repasse para humanos quando fizer sentido."
    >
      <section className="inbox-console">
        <div className="inbox-board">
          <div className="inbox-board-head">
            <div>
              <span className="workspace-kicker">Conversas</span>
              <h2>Fila multicanal com contexto.</h2>
              <p>WhatsApp, Instagram e outros canais em uma visão simples para resposta rápida e repasse seguro.</p>
            </div>
            <Link className="btn btn-primary" href="/automations">
              Criar automação
            </Link>
          </div>

          <div className="inbox-columns">
            {["Novo", "Em atendimento", "Qualificado"].map((column) => {
              const items = leads.filter((lead) =>
                column === "Novo"
                  ? !/qualifica|proposta|fech/i.test(lead.stage)
                  : column === "Qualificado"
                    ? /qualifica|proposta|fech/i.test(lead.stage)
                    : /atendimento|contato|negocia/i.test(lead.stage)
              );

              return (
                <section className="inbox-column" key={column}>
                  <div className="inbox-column-head">
                    <strong>{column}</strong>
                    <span>{items.length}</span>
                  </div>
                  {items.length ? (
                    items.map((lead) => (
                      <article className="inbox-conversation" key={lead.id}>
                        <div>
                          <strong>{lead.name}</strong>
                          <span className={channelTone(lead.channel)}>{lead.channel}</span>
                        </div>
                        <p>{lead.lastMessage}</p>
                        <div className="inbox-conversation-foot">
                          <span>{lead.stage}</span>
                          <Link href="/leads">Ver perfil</Link>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="inbox-empty-mini">Nenhuma conversa nesta etapa.</div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <aside className="inbox-context">
          <span className="workspace-kicker">Ações rápidas</span>
          <h3>Repasse com contexto</h3>
          <p>Use a inbox para priorizar leads quentes, revisar histórico e decidir se o bot continua ou se a equipe assume.</p>
          <div className="inbox-action-list">
            <Link href="/automations">Criar fluxo de triagem</Link>
            <Link href="/integrations">Conectar canal</Link>
            <Link href="/executions">Ver último debug</Link>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
