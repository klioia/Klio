import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { decodeTrigger } from "@/lib/automation-utils";
import { dispatchAutomation } from "@/lib/dispatch";
import { createExecution, getAutomationById } from "@/lib/repositories";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();
  const automation = await getAutomationById(body.automationId, session?.id);

  if (!automation) {
    return NextResponse.json({ ok: false, error: "Fluxo não encontrado." }, { status: 404 });
  }

  const trigger = decodeTrigger(automation.trigger);
  const effectiveChannel =
    body.channel === "multi" || !body.channel
      ? automation.channel === "multi"
        ? "whatsapp"
        : automation.channel
      : body.channel;

  if (trigger.actionType === "notify_team") {
    await createExecution({
      id: `execution_${Date.now()}`,
      automationId: automation.id,
      automationName: automation.name,
      channel: "internal",
      contactName: body.contactName || "cliente",
      recipient: body.recipient || "time",
      status: "notified",
      preview: `Aviso interno: ${automation.name} disparou para ${body.contactName || "cliente"}.`,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      ok: true,
      preview: `Aviso interno: ${automation.name} disparou para ${body.contactName || "cliente"}.`
    });
  }

  try {
    const result = await dispatchAutomation({
      userId: automation.userId,
      automationId: automation.id,
      automationName: automation.name,
      trigger: automation.trigger,
      primaryMessage: automation.message,
      channel: effectiveChannel,
      recipient: body.recipient,
      contactName: body.contactName || "cliente"
    });

    if (result.providerResponse) {
      return NextResponse.json({
        ok: result.ok,
        providerResponse: result.providerResponse,
        preview: result.preview
      });
    }

    return NextResponse.json({
      ok: true,
      mock: true,
      preview: result.preview
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao executar fluxo."
      },
      { status: 500 }
    );
  }
}
