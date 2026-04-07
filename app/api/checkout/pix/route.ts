import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrismaClient, hasDatabaseUrl } from "@/lib/db";
import { createPixCharge } from "@/lib/pix";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getSession();
  const amount = Number(body.amount ?? 0);
  const customerName = String(body.customerName ?? "").trim();
  const customerEmail = String(body.customerEmail ?? "").trim();

  if (!customerName || !customerEmail || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Informe nome, email e valor valido para gerar o Pix."
      },
      { status: 400 }
    );
  }

  const charge = await createPixCharge({
    userId: session?.id,
    customerName,
    customerEmail,
    customerExternalId: body.customerExternalId,
    amount,
    description: body.description ?? "Assinatura Klio"
  });

  if (hasDatabaseUrl() && session?.id) {
    const prisma = getPrismaClient();
    await prisma.pixCheckout.create({
      data: {
        tenantId: session.tenantId!,
        userId: session.id,
        customerName,
        customerEmail,
        amount,
        description: body.description ?? "Assinatura Klio",
        provider: charge.provider,
        externalId: charge.id,
        status: charge.status,
        qrCodeText: charge.qrCodeText,
        copyPasteCode: charge.copyPasteCode
      }
    });
  }

  return NextResponse.json({
    ok: true,
    charge
  });
}
