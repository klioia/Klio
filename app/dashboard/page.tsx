import { AppShell } from "@/components/app-shell";
import { AutoProcessJobs } from "@/components/auto-process-jobs";
import { FlowBuilder } from "@/components/flow-builder";
import { ProcessJobsButton } from "@/components/process-jobs-button";
import { humanizeTrigger } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { dashboardStats, inbox } from "@/lib/mock-data";
import { AutomationRecord, ScheduledJobRecord, listAutomations, listScheduledJobs } from "@/lib/repositories";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();
  const automations = await listAutomations(session.id);
  const scheduledJobs = await listScheduledJobs(session.id);
  const pendingJobs = (scheduledJobs as ScheduledJobRecord[]).filter((job) => job.status === "pending").length;

  return (
    <AppShell
      userName={session.name}
      title="Workspace real da Klio."
      description="Crie fluxos, conecte canais, acompanhe a fila e opere a automacao de WhatsApp e Instagram em uma unica area."
    >
      <section className="card panel">
        <div className="flow-item">
          <div>
            <strong>Comece por aqui</strong>
            <div className="mini">Os atalhos principais para configurar e usar a plataforma de verdade.</div>
          </div>
          <span className="pricing-badge">Operacao</span>
        </div>
        <div className="flow-list" style={{ marginTop: 18 }}>
          <Link className="workspace-link" href="/integrations">
            <strong>Conectar canais</strong>
            <span className="mini">WhatsApp, Instagram e webhook</span>
          </Link>
          <Link className="workspace-link" href="/automations">
            <strong>Abrir fluxos</strong>
            <span className="mini">biblioteca e logica da automacao</span>
          </Link>
          <Link className="workspace-link" href="/leads">
            <strong>Ver leads</strong>
            <span className="mini">contatos, contexto e origem</span>
          </Link>
        </div>
      </section>
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
                  <div className="mini">fila, worker e disparos em andamento</div>
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
              <strong>Fluxos ativos agora</strong>
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
  );
}
