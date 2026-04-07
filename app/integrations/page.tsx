import { AppShell } from "@/components/app-shell";
import { IntegrationsForm } from "@/components/integrations-form";
import { Topbar } from "@/components/topbar";
import { requireSession } from "@/lib/auth";
import { getIntegrations } from "@/lib/repositories";

type Integrations = {
  whatsapp: { connected: boolean; label: string; phoneNumberId: string; accessToken?: string; verifyToken?: string };
  instagram: { connected: boolean; label: string; appId: string; accessToken?: string; verifyToken?: string };
  pix: { connected: boolean; label: string; provider: string; accessToken?: string };
};

export default async function IntegrationsPage() {
  const session = await requireSession();
  const integrations = await getIntegrations(session.tenantId) as Integrations;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <>
      <Topbar />
      <AppShell
        userName={session.name}
        title="Camada de integracoes da automacao."
        description="Conecte canais, credenciais e webhooks da operacao pela interface da Klio, sem depender so de configuracao manual."
      >
        <IntegrationsForm appUrl={appUrl} initialState={integrations} />
      </AppShell>
    </>
  );
}
