import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getIntegrations, updateIntegrations } from "@/lib/repositories";
import { testMetaConnectionForTenant } from "@/lib/meta";

type IntegrationPayload = {
  channel: "whatsapp" | "instagram" | "pix";
  values: Record<string, string>;
};

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Sessão inválida." }, { status: 401 });
  }

  const integrations = await getIntegrations(session.tenantId);
  return NextResponse.json({ ok: true, integrations });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  const body = (await request.json()) as IntegrationPayload;
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sessão inválida." }, { status: 401 });
  }

  const current = await getIntegrations(session.tenantId) as any;

  const nextState = {
    ...current,
    [body.channel]: {
      ...current[body.channel],
      tenantId: session.tenantId,
      ...body.values,
      connected:
        body.channel === "pix"
          ? Boolean(body.values.accessToken || current.pix?.accessToken)
          : Boolean(body.values.accessToken)
    }
  };

  await updateIntegrations(nextState, session.tenantId);

  return NextResponse.json({ ok: true, integrations: nextState });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Sessão inválida." }, { status: 401 });
  }

  if (body.channel !== "whatsapp" && body.channel !== "instagram") {
    return NextResponse.json({ ok: false, error: "Canal de teste invalido." }, { status: 400 });
  }

  try {
    const result = await testMetaConnectionForTenant(body.channel, session.tenantId);
    return NextResponse.json({ ok: result.ok, status: result.status, data: result.data }, { status: result.ok ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao testar conexao."
      },
      { status: 500 }
    );
  }
}
