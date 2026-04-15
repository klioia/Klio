import { AppShell } from "@/components/app-shell";
import { FlowBuilder } from "@/components/flow-builder";
import { requireSession } from "@/lib/auth";
import { AutomationRecord, listAutomations } from "@/lib/repositories";

export default async function AutomationsPage() {
  const session = await requireSession();
  const automations = (await listAutomations(session.id)) as AutomationRecord[];

  return (
    <AppShell
      userName={session.name}
      title="Flow Studio"
      description="Crie, publique, teste e acompanhe seus fluxos de WhatsApp, Instagram e outros canais em uma experiência guiada."
    >
      <FlowBuilder initialAutomations={automations} />
    </AppShell>
  );
}
