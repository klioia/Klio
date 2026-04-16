import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { AutomationRecord, ExecutionRecord, LeadRecord, listAutomations, listExecutions, listLeads } from "@/lib/repositories";

function percent(value: number, total: number) {
  if (!total) return "—";
  return `${Math.round((value / total) * 100)}%`;
}

export default async function AnalyticsPage() {
  const session = await requireSession();
  const [executions, leads, automations] = await Promise.all([
    listExecutions(session.id) as Promise<ExecutionRecord[]>,
    listLeads(session.id) as Promise<LeadRecord[]>,
    listAutomations(session.id) as Promise<AutomationRecord[]>
  ]);

  const successful = executions.filter((item) => !item.status.includes("error") && !item.status.includes("failed")).length;
  const qualified = leads.filter((item) => /qualifica|proposta|negocia|fech/i.test(item.stage)).length;
  const active = automations.filter((item) => item.status === "Ativa").length;
  const channels = Array.from(new Set([...leads.map((lead) => lead.channel), ...executions.map((execution) => execution.channel)])).filter(Boolean);

  return (
    <AppShell
      userName={session.name}
      title="Analytics da operação"
      description="Acompanhe resposta, aproveitamento de leads, conversão por fluxo e gargalos de atendimento."
    >
      <section className="analytics-console">
        <div className="analytics-hero">
          <div>
            <span className="workspace-kicker">Performance</span>
            <h2>Métricas que mostram se a automação está vendendo melhor.</h2>
          </div>
          <div className="analytics-kpi-grid">
            <article>
              <span>Taxa de resposta</span>
              <strong>{percent(successful, executions.length)}</strong>
              <p>{executions.length ? `${successful}/${executions.length} execuções sem erro` : "Aguardando execuções reais"}</p>
            </article>
            <article>
              <span>Leads aproveitados</span>
              <strong>{percent(qualified, leads.length)}</strong>
              <p>{leads.length ? `${qualified}/${leads.length} contatos qualificados` : "Sem contatos capturados ainda"}</p>
            </article>
            <article>
              <span>Fluxos ativos</span>
              <strong>{active}</strong>
              <p>{automations.length ? `${automations.length} fluxos na biblioteca` : "Crie o primeiro fluxo"}</p>
            </article>
            <article>
              <span>Canais com dados</span>
              <strong>{channels.length}</strong>
              <p>{channels.length ? channels.join(", ") : "Conecte WhatsApp ou Instagram"}</p>
            </article>
          </div>
        </div>

        <div className="analytics-grid">
          <section className="analytics-panel">
            <strong>Conversão por fluxo</strong>
            <div className="analytics-list">
              {automations.length ? (
                automations.map((automation) => {
                  const runs = executions.filter((execution) => execution.automationId === automation.id).length;
                  return (
                    <div className="analytics-row" key={automation.id}>
                      <div>
                        <span>{automation.channel}</span>
                        <strong>{automation.name}</strong>
                      </div>
                      <em>{runs} execuções</em>
                    </div>
                  );
                })
              ) : (
                <p className="mini">Nenhum fluxo publicado ainda.</p>
              )}
            </div>
          </section>

          <section className="analytics-panel">
            <strong>Gargalos detectados</strong>
            <div className="analytics-list">
              <div className="analytics-row">
                <div>
                  <span>Status</span>
                  <strong>{executions.some((item) => item.status.includes("error")) ? "Falhas precisam de revisão" : "Sem falhas críticas"}</strong>
                </div>
                <em>{executions.filter((item) => item.status.includes("error")).length} erros</em>
              </div>
              <div className="analytics-row">
                <div>
                  <span>CRM</span>
                  <strong>{leads.length ? "Contatos em acompanhamento" : "Sem base de contatos"}</strong>
                </div>
                <em>{leads.length} leads</em>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
