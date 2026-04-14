import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AutoProcessJobs } from "@/components/auto-process-jobs";
import { FlowBuilder } from "@/components/flow-builder";
import { ProcessJobsButton } from "@/components/process-jobs-button";
import { humanizeTrigger } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { dashboardStats, inbox } from "@/lib/mock-data";
import { AutomationRecord, ScheduledJobRecord, getIntegrations, listAutomations, listScheduledJobs } from "@/lib/repositories";

function channelState(connected: boolean, label: string) {
  return {
    label,
    status: connected ? "Conectado" : "Pendente",
    tone: connected ? "tag tag-success" : "tag tag-warning"
  };
}

export default async function DashboardPage() {
  const session = await requireSession();
  const automations = (await listAutomations(session.id)) as AutomationRecord[];
  const scheduledJobs = (await listScheduledJobs(session.id)) as ScheduledJobRecord[];
  const integrations = await getIntegrations(session.tenantId);

  const pendingJobs = scheduledJobs.filter((job) => job.status === "pending").length;
  const activeAutomations = automations.filter((item) => item.status === "Ativa").length;
  const integrationsReady = [
    integrations.whatsapp?.connected,
    integrations.instagram?.connected
  ].filter(Boolean).length;
  const coverage = Math.round((integrationsReady / 2) * 100);
  const automationReadiness = automations.length ? Math.round((activeAutomations / automations.length) * 100) : 0;

  const channelStates = [
    channelState(Boolean(integrations.whatsapp?.connected), "WhatsApp"),
    channelState(Boolean(integrations.instagram?.connected), "Instagram")
  ];

  const nextActions = [
    integrations.whatsapp?.connected
      ? "WhatsApp validado para testes e produção."
      : "Conecte o WhatsApp para iniciar testes com número real.",
    integrations.instagram?.connected
      ? "Instagram pronto para DM e comentário."
      : "Conecte o Instagram para centralizar comentários e mensagens.",
    activeAutomations
      ? "Fluxos ativos disponíveis para disparo e acompanhamento."
      : "Crie e publique ao menos um fluxo para ativar a operação."
  ];

  return (
    <AppShell
      userName={session.name}
      title="Overview operacional"
      description="Monitore saúde dos canais, capacidade do motor, fluxos ativos e fila de atendimento com leitura rápida e contexto real."
    >
      <section className="command-deck">
        <div className="command-spotlight">
          <div className="command-spotlight-head">
            <div>
              <span className="workspace-kicker">Mission control</span>
              <h2>Operação multicanal pronta para rodar com contexto, velocidade e prioridade.</h2>
            </div>
            <span className="workspace-chip workspace-chip-live">Online agora</span>
          </div>

          <div className="command-highlight-grid">
            <div className="command-highlight-card">
              <span className="mini">Canais conectados</span>
              <strong>{coverage}%</strong>
              <p>{integrationsReady}/2 canais principais já estão liberados para operação.</p>
            </div>
            <div className="command-highlight-card">
              <span className="mini">Fluxos em produção</span>
              <strong>{activeAutomations}</strong>
              <p>{automationReadiness}% da biblioteca atual está em estado ativo.</p>
            </div>
            <div className="command-highlight-card">
              <span className="mini">Fila pendente</span>
              <strong>{pendingJobs}</strong>
              <p>Etapas aguardando execução automática no worker da Klio.</p>
            </div>
          </div>

          <div className="command-lane">
            <div className="command-lane-step">
              <span>Entrada</span>
              <strong>Captura de mensagem</strong>
            </div>
            <div className="command-lane-step">
              <span>Decisão</span>
              <strong>Resposta e qualificação</strong>
            </div>
            <div className="command-lane-step">
              <span>Entrega</span>
              <strong>Repasse e acompanhamento</strong>
            </div>
          </div>
        </div>

        <div className="command-side">
          <section className="command-panel">
            <div className="command-panel-head">
              <strong>Saúde dos canais</strong>
              <Link href="/integrations">Abrir integrações</Link>
            </div>
            <div className="command-status-list">
              {channelStates.map((item) => (
                <div className="command-status-row" key={item.label}>
                  <div>
                    <span className="mini">{item.label}</span>
                    <strong>{item.status}</strong>
                  </div>
                  <span className={item.tone}>{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="command-panel">
            <div className="command-panel-head">
              <strong>Próximos passos</strong>
              <Link href={integrationsReady === 2 ? "/automations" : "/integrations"}>Abrir área</Link>
            </div>
            <div className="command-action-list">
              {nextActions.map((item) => (
                <div className="command-action-item" key={item}>
                  <span className="command-action-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="command-panel command-panel-compact">
            <div className="command-panel-head">
              <strong>Execução automática</strong>
              <span className="workspace-chip">Worker</span>
            </div>
            <div className="command-worker-stack">
              <AutoProcessJobs />
              <ProcessJobsButton />
            </div>
          </section>
        </div>
      </section>

      <section className="overview-strip">
        {dashboardStats.map((item) => (
          <article className="overview-stat" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.trend}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-workbench">
        <FlowBuilder initialAutomations={automations} />

        <div className="dashboard-rail">
          <section className="command-panel">
            <div className="command-panel-head">
              <strong>Inbox operacional</strong>
              <Link href="/leads">Ver fila completa</Link>
            </div>
            <div className="live-feed-list">
              {inbox.map((item) => (
                <div className="live-feed-item" key={item.id}>
                  <div>
                    <strong>{item.contact}</strong>
                    <div className="mini">{item.origin}</div>
                    <p>{item.text}</p>
                  </div>
                  <span className={item.status === "Novo" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="command-panel">
            <div className="command-panel-head">
              <strong>Fluxos ativos agora</strong>
              <Link href="/automations">Abrir biblioteca</Link>
            </div>
            <div className="command-status-list">
              {automations.length ? (
                automations.map((item) => (
                  <div className="command-status-row" key={item.id}>
                    <div>
                      <span className="mini">{item.channel}</span>
                      <strong>{item.name}</strong>
                      <p>{humanizeTrigger(item.trigger)}</p>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </div>
                ))
              ) : (
                <div className="builder-empty-state">
                  <strong>Nenhum fluxo ativo</strong>
                  <p className="mini">Publique seu primeiro fluxo para começar a operação com automação real.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
