import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { encodeTrigger } from "@/lib/automation-utils";
import { AutomationRecord, createAutomation, listAutomations } from "@/lib/repositories";

export async function GET() {
  const session = await getSession();
  const automations = await listAutomations(session?.id);
  return NextResponse.json({ ok: true, automations });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Sessão inválida." }, { status: 401 });
  }

  const automation: AutomationRecord = {
    id: `automation_${Date.now()}`,
    tenantId: session.tenantId,
    userId: session.id,
    name: body.name,
    channel: body.channel,
    trigger: encodeTrigger({
      triggerType: body.triggerType ?? "keyword",
      keyword: body.keyword ?? "",
      actionType: body.actionType ?? "reply_same_channel",
      secondMessage: body.secondMessage ?? "",
      delayMinutes: Number(body.delayMinutes ?? 0)
    }),
    status: body.status ?? "Rascunho",
    message: body.message
  };

  await createAutomation(automation);

  return NextResponse.json({ ok: true, automation }, { status: 201 });
}
