import { NextRequest, NextResponse } from "next/server";
import { decodeTrigger } from "@/lib/automation-utils";
import { dispatchAutomation } from "@/lib/dispatch";
import { validateWebhook } from "@/lib/meta";
import { AutomationRecord, listAutomations } from "@/lib/repositories";

type IncomingEvent = {
  channel: "whatsapp" | "instagram";
  senderId: string;
  senderName: string;
  text: string;
};

function extractIncomingEvent(body: any): IncomingEvent | null {
  const whatsappMessage = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const whatsappContact = body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

  if (whatsappMessage) {
    return {
      channel: "whatsapp",
      senderId: whatsappMessage.from,
      senderName: whatsappContact?.profile?.name || "cliente",
      text: whatsappMessage.text?.body || ""
    };
  }

  const instagramMessage = body?.entry?.[0]?.messaging?.[0];

  if (instagramMessage?.message?.text) {
    return {
      channel: "instagram",
      senderId: instagramMessage.sender?.id || "",
      senderName: "cliente",
      text: instagramMessage.message.text
    };
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = await validateWebhook(
    searchParams.get("hub.mode"),
    searchParams.get("hub.verify_token"),
    searchParams.get("hub.challenge")
  );

  if (!challenge) {
    return NextResponse.json({ error: "Falha na validacao do webhook." }, { status: 403 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const incoming = extractIncomingEvent(body);

  if (!incoming) {
    return NextResponse.json({
      ok: true,
      receivedAt: new Date().toISOString(),
      event: body,
      matched: false
    });
  }

  const automations = await listAutomations();
  const activeAutomation = (automations as AutomationRecord[]).find((automation) => {
    if (automation.status !== "Ativa") {
      return false;
    }

    const channelMatches = automation.channel === "multi" || automation.channel.toLowerCase() === incoming.channel;
    const trigger = decodeTrigger(automation.trigger);

    if (!channelMatches) {
      return false;
    }

    if (trigger.triggerType === "new_message") {
      return true;
    }

    if (trigger.triggerType === "keyword") {
      return Boolean(trigger.keyword) && incoming.text.toLowerCase().includes(String(trigger.keyword).toLowerCase());
    }

    return false;
  });

  if (!activeAutomation) {
    return NextResponse.json({
      ok: true,
      receivedAt: new Date().toISOString(),
      matched: false,
      event: body
    });
  }

  try {
    const result = await dispatchAutomation({
      userId: activeAutomation.userId,
      tenantId: activeAutomation.tenantId,
      automationId: activeAutomation.id,
      automationName: activeAutomation.name,
      trigger: activeAutomation.trigger,
      primaryMessage: activeAutomation.message,
      channel: incoming.channel,
      recipient: incoming.senderId,
      contactName: incoming.senderName
    });

    if (result.providerResponse) {
      return NextResponse.json({
        ok: result.ok,
        matched: true,
        automation: activeAutomation.name,
        providerResponse: result.providerResponse
      });
    }

    return NextResponse.json({
      ok: true,
      matched: true,
      automation: activeAutomation.name,
      preview: result.preview
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        matched: true,
        automation: activeAutomation.name,
        error: error instanceof Error ? error.message : "Falha ao processar webhook."
      },
      { status: 500 }
    );
  }
}
