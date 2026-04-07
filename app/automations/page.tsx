import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { describeFlow, humanizeAction, humanizeTrigger } from "@/lib/automation-utils";
import { requireSession } from "@/lib/auth";
import { AutomationRecord, listAutomations } from "@/lib/repositories";

export default async function AutomationsPage() {
  const session = await requireSession();
  const automations = await listAutomations(session.id);

  return (
    <>
      <Topbar />
      <AppShell
        userName={session.name}
        title="Biblioteca de fluxos da engine."
        description="Cada automacao da Klio combina trigger, resposta do bot e logica operacional para WhatsApp e Instagram."
      >
        <div className="flow-list">
          {(automations as AutomationRecord[]).map((item, index) => (
            <article className="card panel automation-card-premium" key={item.id}>
              <div className="automation-card-head">
                <div>
                  <strong>{item.name}</strong>
                  <div className="mini">
                    fluxo {String(index + 1).padStart(2, "0")} • {item.channel}
                  </div>
                </div>
                <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
              </div>
              <div className="builder-preview" style={{ marginTop: 18 }}>
                <div className="builder-node">
                  <span className="mini">Trigger</span>
                  <strong>{humanizeTrigger(item.trigger)}</strong>
                </div>
                <div className="builder-arrow">→</div>
                <div className="builder-node">
                  <span className="mini">Acao</span>
                  <strong>{humanizeAction(item.trigger)}</strong>
                </div>
                <div className="builder-arrow">→</div>
                <div className="builder-node builder-node-soft">
                  <span className="mini">Fluxo</span>
                  <strong>{describeFlow(item.trigger)}</strong>
                </div>
              </div>
              <label style={{ display: "block", marginTop: 18 }}>
                <span className="mini">Mensagem do bot</span>
                <textarea className="textarea" readOnly value={item.message} />
              </label>
            </article>
          ))}
        </div>
      </AppShell>
    </>
  );
}
