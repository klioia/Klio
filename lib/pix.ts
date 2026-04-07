export type CheckoutPayload = {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerExternalId?: string;
  amount: number;
  description: string;
};

type PixChargeResult = {
  id: string;
  status: string;
  provider: string;
  amount: number;
  qrCodeText: string;
  copyPasteCode: string;
};

async function createMercadoPagoPixCharge(payload: CheckoutPayload): Promise<PixChargeResult> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado.");
  }

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": `pix-${Date.now()}-${payload.customerEmail}`
    },
    body: JSON.stringify({
      transaction_amount: payload.amount,
      description: payload.description,
      payment_method_id: "pix",
      payer: {
        email: payload.customerEmail,
        first_name: payload.customerName
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Falha ao criar cobranca Pix no Mercado Pago.");
  }

  return {
    id: String(data.id),
    status: data.status ?? "pending",
    provider: "mercado_pago",
    amount: payload.amount,
    qrCodeText: data.point_of_interaction?.transaction_data?.qr_code ?? "",
    copyPasteCode: data.point_of_interaction?.transaction_data?.qr_code ?? ""
  };
}

async function createAsaasPixCharge(payload: CheckoutPayload): Promise<PixChargeResult> {
  const apiKey = process.env.ASAAS_API_KEY;
  const baseUrl = process.env.ASAAS_BASE_URL || "https://api-sandbox.asaas.com";
  const customerId = payload.customerExternalId || process.env.ASAAS_DEFAULT_CUSTOMER_ID;

  if (!apiKey) {
    throw new Error("ASAAS_API_KEY nao configurada.");
  }

  if (!customerId) {
    throw new Error("Para usar Asaas, informe customerExternalId ou ASAAS_DEFAULT_CUSTOMER_ID.");
  }

  const chargeResponse = await fetch(`${baseUrl}/v3/payments`, {
    method: "POST",
    headers: {
      access_token: apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      billingType: "PIX",
      customer: customerId,
      value: payload.amount,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      description: payload.description
    })
  });

  const chargeData = await chargeResponse.json();

  if (!chargeResponse.ok) {
    throw new Error(chargeData.errors?.[0]?.description || "Falha ao criar cobranca Pix no Asaas.");
  }

  const qrResponse = await fetch(`${baseUrl}/v3/payments/${chargeData.id}/pixQrCode`, {
    headers: {
      access_token: apiKey
    }
  });

  const qrData = await qrResponse.json();

  if (!qrResponse.ok) {
    throw new Error(qrData.errors?.[0]?.description || "Falha ao obter QR Code Pix no Asaas.");
  }

  return {
    id: String(chargeData.id),
    status: chargeData.status ?? "PENDING",
    provider: "asaas",
    amount: payload.amount,
    qrCodeText: qrData.encodedImage || "",
    copyPasteCode: qrData.payload || ""
  };
}

function createMockPixCharge(payload: CheckoutPayload): PixChargeResult {
  const receiverName = process.env.PIX_RECEIVER_NAME || "Seu Negocio";
  const receiverKey = process.env.PIX_RECEIVER_KEY || "sua-chave-pix";

  return {
    id: `pix_${Date.now()}`,
    status: "pending",
    provider: "mock",
    amount: payload.amount,
    qrCodeText: `PIX|${receiverName}|${receiverKey}|${payload.amount.toFixed(2)}|${payload.description}`,
    copyPasteCode: `${receiverKey}|${payload.customerName}|${payload.amount.toFixed(2)}`
  };
}

export async function createPixCharge(payload: CheckoutPayload) {
  if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return createMercadoPagoPixCharge(payload);
  }

  if (process.env.ASAAS_API_KEY) {
    return createAsaasPixCharge(payload);
  }

  return createMockPixCharge(payload);
}
