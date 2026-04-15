import { AppShell } from "@/components/app-shell";
import { buildExecutionDebugSteps } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { ExecutionRecord, listExecutions } from "@/lib/repositories";

function statusLabel(status: string) {
  if (status.includes("error") || status.includes("failed")) return "Falhou";
  if (status.includes("mock")) return "Simulado";
  if (status.includes("notified")) return "Equipe avisada";
  if (status.includes("sent")) return "Enviado";
  return status;
}

function statusClass(status: string) {
  if (status.includes("error") || status.includes("failed")) return "execution-status execution-status-error";
  if (status.includes("mock")) return "execution-status execution-status-mock";
  return "execution-status execution-status-success";
}

function stepStatusClass(status: string) {
  return `execution-step-dot execution-step-dot-${status}`;
}

export default async function ExecutionsPage() {
  const session = await requireSession();
  const executions = (await listExecutions(session.id)) as ExecutionRecord[];

  const total = executions.length;
  const failed = executions.filter((item) => item.status.includes("error") || item.status.includes("failed")).length;
  const sent = executions.filter((item) => item.status.includes("sent") || item.status.includes("notified")).length;
  const simulated = executions.filter((item) => item.status.includes("mock")).length;

  return (
    <AppShell
      userName={session.name}
      title="Execuções e debug"
      description="Acompanhe cada disparo, veja os nós executados e descubra onde um fluxo precisa de atenção."
    >
      <section className="execution-console">
        <div className="execution-overview">
          <div>
            <span className="workspace-kicker">Monitoramento</span>
            <h2>Debug operacional dos fluxos.</h2>
            <p>Timeline por nó, saída gerada, destino e status de entrega em uma visão única.</p>
          </div>
          <div className="execution-kpis">
            <div>
              <span>Total</span>
              <strong>{total}</strong>
            </div>
            <div>
              <span>Enviadas</span>
              <strong>{sent}</strong>
            </div>
            <div>
              <span>Simuladas</span>
              <strong>{simulated}</strong>
            </div>
            <div>
              <span>Falhas</span>
              <strong>{failed}</strong>
            </div>
          </div>
        </div>

        <div className="execution-list">
          {executions.length ? (
            executions.map((item) => {
              const steps = buildExecutionDebugSteps({
                trigger: item.automationTrigger,
                preview: item.preview,
                status: item.status,
                channel: item.channel,
                contactName: item.contactName
              });
              const hasError = item.status.includes("error") || item.status.includes("failed");

              return (
                <article className="execution-card" key={item.id}>
                  <header className="execution-card-head">
                    <div>
                      <span className="workspace-kicker">{item.channel}</span>
                      <h3>{item.automationName}</h3>
                      <p>
                        {item.contactName} · {item.recipient} · {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <span className={statusClass(item.status)}>{statusLabel(item.status)}</span>
                  </header>

                  <div className="execution-debug-grid">
                    <div className="execution-timeline">
                      {steps.map((step) => (
                        <div className="execution-step" key={step.id}>
                          <span className={stepStatusClass(step.status)} />
                          <div>
                            <div className="execution-step-head">
                              <strong>{step.label}</strong>
                              <span>{step.durationMs}ms</span>
                            </div>
                            <p>{step.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="execution-inspector">
                      <div>
                        <span>Entrada</span>
                        <code>{steps[0]?.input || `${item.channel} · ${item.contactName}`}</code>
                      </div>
                      <div>
                        <span>Saída final</span>
                        <code>{item.preview}</code>
                      </div>
                      <div>
                        <span>Diagnóstico</span>
                        <p>
                          {hasError
                            ? "A execução encontrou uma falha no provedor ou na configuração do canal. Revise credenciais, número de destino e permissões."
                            : "Fluxo processado sem erro crítico. Use o replay para repetir o teste quando ajustar mensagens ou conexões."}
                        </p>
                      </div>
                      <div className="execution-actions">
                        <a className="btn btn-secondary" href={`/automations?replay=${item.automationId}`}>
                          Abrir fluxo
                        </a>
                        <a className="btn btn-primary" href={`/automations?test=${item.automationId}`}>
                          Repetir teste
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="execution-empty">
              <span className="workspace-kicker">Sem execuções</span>
              <h3>Nenhum fluxo rodou ainda.</h3>
              <p>Crie um fluxo no Flow Studio e use “Enviar teste” para gerar o primeiro histórico de debug.</p>
              <a className="btn btn-primary" href="/automations">
                Abrir Flow Studio
              </a>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
