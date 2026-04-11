import { AppShell } from "@/components/app-shell";
import { IntegrationsForm } from "@/components/integrations-form";
import { requireSession } from "@/lib/auth";
import { getIntegrations } from "@/lib/repositories";

type Integrations = {
  whatsapp: { connected: boolean; label: string; phoneNumberId: string; accessToken?: string; verifyToken?: string };
  instagram: { connected: boolean; label: string; appId: string; accessToken?: string; verifyToken?: string };
  pix: { connected: boolean; label: string; provider: string; accessToken?: string };
};

export default async function IntegrationsPage() {
  const session = await requireSession();
  const integrations = (await getIntegrations(session.tenantId)) as Integrations;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <AppShell
      userName={session.name}
      title="Integrações da operação"
      description="Conecte canais, salve credenciais, copie o callback e valide tudo pela interface da Klio."
    >
      <IntegrationsForm appUrl={appUrl} initialState={integrations} />
    </AppShell>
  );
}

