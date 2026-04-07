import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendMetaMessageForTenant } from "@/lib/meta";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Sessao invalida." }, { status: 401 });
  }

  try {
    const response = await sendMetaMessageForTenant({
      channel: body.channel,
      recipient: body.recipient,
      message: body.message,
      tenantId: session.tenantId
    });

    const data = await response.json();

    return NextResponse.json({ ok: response.ok, providerResponse: data }, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao enviar mensagem."
      },
      { status: 500 }
    );
  }
}
