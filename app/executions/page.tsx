import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { ExecutionRecord, listExecutions } from "@/lib/repositories";

export default async function ExecutionsPage() {
  const session = await requireSession();
  const executions = await listExecutions(session.id);

  return (
    <AppShell
      userName={session.name}
      title="Historico de execucoes."
      description="Veja cada disparo, para quem o fluxo rodou e qual foi o resultado da execucao."
    >
      <div className="flow-list">
        {(executions as ExecutionRecord[]).map((item) => (
          <article className="card panel automation-card-premium" key={item.id}>
            <div className="automation-card-head">
              <div>
                <strong>{item.automationName}</strong>
                <div className="mini">
                  {item.channel} - {item.contactName}
                </div>
              </div>
              <span className={item.status.includes("error") ? "tag tag-warning" : "tag tag-success"}>{item.status}</span>
            </div>
            <p className="muted" style={{ marginTop: 16 }}>
              {item.preview}
            </p>
            <div className="builder-preview" style={{ marginTop: 16 }}>
              <div className="builder-node">
                <span className="mini">Destino</span>
                <strong>{item.recipient}</strong>
              </div>
              <div className="builder-arrow">{`->`}</div>
              <div className="builder-node builder-node-soft">
                <span className="mini">Executado em</span>
                <strong>{new Date(item.createdAt).toLocaleString("pt-BR")}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
