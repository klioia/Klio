import { AppShell } from "@/components/app-shell";
import { AutoProcessJobs } from "@/components/auto-process-jobs";
import { ProcessJobsButton } from "@/components/process-jobs-button";
import { requireSession } from "@/lib/auth";
import { ScheduledJobRecord, listScheduledJobs } from "@/lib/repositories";

export default async function ScheduledPage() {
  const session = await requireSession();
  const jobs = await listScheduledJobs(session.id);

  function getRemainingText(dateString: string, status: string) {
    if (status !== "pending") {
      return "Já processado";
    }

    const diff = new Date(dateString).getTime() - Date.now();

    if (diff <= 0) {
      return "Pronto para envio";
    }

    const minutes = Math.ceil(diff / 60000);
    return `Faltam ${minutes} min`;
  }

  return (
    <AppShell
      userName={session.name}
      title="Fila de execução agendada"
      description="Acompanhe as próximas etapas da automação, com horário previsto, status e visibilidade de cada disparo."
    >
      <div className="card panel orchestration-panel" style={{ marginBottom: 24 }}>
        <div className="orchestration-header">
          <div>
            <strong>Scheduler da Klio</strong>
            <div className="mini">Controle de etapas futuras e reengajamentos automáticos</div>
          </div>
          <span className="pricing-badge">fila viva</span>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ marginBottom: 16 }}>
            <AutoProcessJobs />
          </div>
          <ProcessJobsButton />
        </div>
      </div>
      <div className="flow-list">
        {(jobs as ScheduledJobRecord[]).map((job) => (
          <article className="card panel automation-card-premium" key={job.id}>
            <div className="automation-card-head">
              <div>
                <strong>{job.automationName}</strong>
                <div className="mini">
                  {job.channel} - {job.contactName}
                </div>
              </div>
              <span className={job.status === "pending" ? "tag tag-warning" : "tag tag-success"}>{job.status}</span>
            </div>
            <p className="muted" style={{ marginTop: 16 }}>
              {job.message}
            </p>
            <div className="builder-preview" style={{ marginTop: 16 }}>
              <div className="builder-node">
                <span className="mini">Agendado para</span>
                <strong>{new Date(job.scheduledFor).toLocaleString("pt-BR")}</strong>
              </div>
              <div className="builder-arrow">{`->`}</div>
              <div className="builder-node">
                <span className="mini">Contagem</span>
                <strong>{getRemainingText(job.scheduledFor, job.status)}</strong>
              </div>
              <div className="builder-arrow">{`->`}</div>
              <div className="builder-node builder-node-soft">
                <span className="mini">Destino</span>
                <strong>{job.recipient}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
