import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { LeadRecord, createLead, listLeads } from "@/lib/repositories";

export async function GET() {
  const session = await getSession();
  const leads = await listLeads(session?.id);
  return NextResponse.json({ ok: true, leads });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();

  const lead: LeadRecord = {
    id: `lead_${Date.now()}`,
    tenantId: session?.tenantId,
    userId: session?.id,
    name: body.name,
    channel: body.channel,
    stage: body.stage,
    email: body.email,
    phone: body.phone,
    lastMessage: body.lastMessage,
    updatedAt: new Date().toISOString()
  };

  await createLead(lead);

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
