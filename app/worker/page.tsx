import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { getWorkerState } from "@/lib/repositories";

export default async function WorkerPage() {
  const session = await requireSession();
  const state = await getWorkerState();

  return (
    <AppShell
      userName={session.name}
      title="Worker da fila."
      description="Aqui voce acompanha o processador backend da fila da Klio."
    >
      <section className="card panel">
        <div className="flow-item">
          <div>
            <strong>Status do worker</strong>
            <div className="mini">Modo: {state.mode}</div>
          </div>
          <span className={state.status === "idle" ? "tag tag-success" : "tag tag-warning"}>{state.status}</span>
        </div>
        <div className="chip-row" style={{ marginTop: 18 }}>
          <span className="tag tag-warning">
            Última execução: {state.lastRunAt ? new Date(state.lastRunAt).toLocaleString("pt-BR") : "nunca"}
          </span>
          <span className="tag tag-warning">Ultimo lote: {state.lastProcessed}</span>
          <span className="tag tag-warning">Pendentes: {state.pending}</span>
        </div>
      </section>
    </AppShell>
  );
}
