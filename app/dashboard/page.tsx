import { AppShell } from "@/components/app-shell";
import { AutoProcessJobs } from "@/components/auto-process-jobs";
import { FlowBuilder } from "@/components/flow-builder";
import { ProcessJobsButton } from "@/components/process-jobs-button";
import { Topbar } from "@/components/topbar";
import { humanizeTrigger } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { dashboardStats, inbox } from "@/lib/mock-data";
import { AutomationRecord, ScheduledJobRecord, listAutomations, listScheduledJobs } from "@/lib/repositories";

export default async function DashboardPage() {
  const session = await requireSession();
  const automations = await listAutomations(session.id);
  const scheduledJobs = await listScheduledJobs(session.id);
  const pendingJobs = (scheduledJobs as ScheduledJobRecord[]).filter((job) => job.status === "pending").length;

  return (
    <>
      <Topbar />
      <AppShell
        userName={session.name}
        title="Centro de comando da automacao conversacional."
        description="Monitore eventos, construa fluxos, acompanhe a fila e opere seus bots de WhatsApp e Instagram em um unico painel."
      >
        <div className="kpi-grid" style={{ marginTop: 24 }}>
          {dashboardStats.map((item) => (
            <div className="kpi" key={item.label}>
              <span className="mini">{item.label}</span>
              <strong>{item.value}</strong>
              <span className="mini">{item.trend}</span>
            </div>
          ))}
          <div className="kpi">
            <span className="mini">Etapas agendadas</span>
            <strong>{pendingJobs}</strong>
            <span className="mini">pendencias na fila</span>
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 24 }}>
          <FlowBuilder initialAutomations={automations as never[]} />
          <div className="flow-list">
            <section className="card panel orchestration-panel">
              <div className="orchestration-header">
                <div>
                  <strong>Engine de execucao</strong>
                  <div className="mini">estado da fila, processamento e automacoes em curso</div>
                </div>
                <span className="pricing-badge">worker ativo</span>
              </div>
              <div className="orchestration-lane" style={{ marginTop: 18 }}>
                <div className="orchestration-step">
                  <span className="mini">01</span>
                  <strong>Evento recebido</strong>
                </div>
                <div className="orchestration-step">
                  <span className="mini">02</span>
                  <strong>Fluxo interpretado</strong>
                </div>
                <div className="orchestration-step">
                  <span className="mini">03</span>
                  <strong>Bot ou handoff</strong>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <div style={{ marginBottom: 16 }}>
                  <AutoProcessJobs />
                </div>
                <ProcessJobsButton />
              </div>
            </section>
            <section className="card panel">
              <strong>Inbox operacional</strong>
              <div className="inbox-list" style={{ marginTop: 18 }}>
                {inbox.map((item) => (
                  <div className="inbox-item" key={item.id}>
                    <div>
                      <div>
                        <strong>{item.contact}</strong> <span className="mini">via {item.origin}</span>
                      </div>
                      <div className="muted">{item.text}</div>
                    </div>
                    <span className={item.status === "Novo" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="card panel">
              <strong>Fluxos ativos na engine</strong>
              <div className="flow-list" style={{ marginTop: 18 }}>
                {(automations as AutomationRecord[]).map((item) => (
                  <div className="flow-item flow-item-rich" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <div className="mini">{humanizeTrigger(item.trigger)}</div>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </AppShell>
    </>
  );
}
