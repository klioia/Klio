import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AutoProcessJobs } from "@/components/auto-process-jobs";
import { FlowBuilder } from "@/components/flow-builder";
import { ProcessJobsButton } from "@/components/process-jobs-button";
import { humanizeTrigger } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { dashboardStats, inbox } from "@/lib/mock-data";
import { AutomationRecord, ScheduledJobRecord, listAutomations, listScheduledJobs } from "@/lib/repositories";

export default async function DashboardPage() {
  const session = await requireSession();
  const automations = await listAutomations(session.id);
  const scheduledJobs = await listScheduledJobs(session.id);
  const pendingJobs = (scheduledJobs as ScheduledJobRecord[]).filter((job) => job.status === "pending").length;
  const activeAutomations = (automations as AutomationRecord[]).filter((item) => item.status === "Ativa").length;

  return (
    <AppShell
      userName={session.name}
      title="Centro operacional da Klio"
      description="Aqui você cria fluxos, acompanha a fila, monitora conversas e coloca a automação para trabalhar de verdade."
    >
      <section className="dashboard-hero">
        <div className="card panel dashboard-hero-main">
          <span className="eyebrow">Operação ao vivo</span>
          <h2 className="dashboard-panel-title">Tudo o que importa para o time operar em um só lugar.</h2>
          <p className="muted">
            Conecte canais, ative fluxos, teste respostas e acompanhe o que está rodando sem pular entre telas.
          </p>
          <div className="dashboard-shortcuts">
            <Link className="workspace-link" href="/integrations">
              <strong>Conectar canais</strong>
              <span className="mini">WhatsApp, Instagram e credenciais</span>
            </Link>
            <Link className="workspace-link" href="/automations">
              <strong>Revisar fluxos</strong>
              <span className="mini">gatilhos, mensagens e status</span>
            </Link>
            <Link className="workspace-link" href="/leads">
              <strong>Ver leads</strong>
              <span className="mini">origem, etapa e contexto</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-side-stack">
          <section className="card panel dashboard-side-card">
            <strong>Resumo da operação</strong>
            <div className="dashboard-side-list" style={{ marginTop: 16 }}>
              <div className="flow-item flow-item-rich">
                <div>
                  <strong>{activeAutomations}</strong>
                  <div className="mini">fluxos ativos</div>
                </div>
                <span className="tag tag-success">rodando</span>
              </div>
              <div className="flow-item flow-item-rich">
                <div>
                  <strong>{pendingJobs}</strong>
                  <div className="mini">etapas agendadas</div>
                </div>
                <span className="tag tag-warning">fila</span>
              </div>
            </div>
          </section>

          <section className="card panel orchestration-panel">
            <div className="orchestration-header">
              <div>
                <strong>Engine de execução</strong>
                <div className="mini">Fila, worker e disparos em andamento</div>
              </div>
              <span className="pricing-badge">worker ativo</span>
            </div>
            <div className="orchestration-lane" style={{ marginTop: 18 }}>
              <div className="orchestration-step">
                <span className="mini">01</span>
                <strong>Entrada</strong>
              </div>
              <div className="orchestration-step">
                <span className="mini">02</span>
                <strong>Resposta</strong>
              </div>
              <div className="orchestration-step">
                <span className="mini">03</span>
                <strong>Repasse</strong>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ marginBottom: 16 }}>
                <AutoProcessJobs />
              </div>
              <ProcessJobsButton />
            </div>
          </section>
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
          <span className="mini">pendências na fila</span>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <FlowBuilder initialAutomations={automations as never[]} />

        <div className="flow-list">
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
            <div className="flow-item">
              <strong>Fluxos ativos agora</strong>
              <Link className="mini" href="/automations">
                abrir biblioteca
              </Link>
            </div>
            <div className="flow-list" style={{ marginTop: 18 }}>
              {(automations as AutomationRecord[]).length ? (
                (automations as AutomationRecord[]).map((item) => (
                  <div className="flow-item flow-item-rich" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <div className="mini">{humanizeTrigger(item.trigger)}</div>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </div>
                ))
              ) : (
                <div className="builder-empty-state">
                  <strong>Nenhum fluxo ativo</strong>
                  <p className="mini">Crie o primeiro fluxo ao lado para começar a operação.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
