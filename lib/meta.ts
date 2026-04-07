import { getPrismaClient, hasDatabaseUrl } from "@/lib/db";
import { getIntegrations } from "@/lib/repositories";

type Channel = "whatsapp" | "instagram";

type SendMessageInput = {
  channel: Channel;
  recipient: string;
  message: string;
};

type ResolvedMetaConfig =
  | {
      channel: "whatsapp";
      accessToken: string;
      phoneNumberId: string;
    }
  | {
      channel: "instagram";
      accessToken: string;
    };

function requireConfigured(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Variavel ${name} nao configurada.`);
  }

  return value;
}

export async function getMetaConfig(channel: Channel): Promise<ResolvedMetaConfig> {
  const integrations = await getIntegrations() as {
    whatsapp?: { accessToken?: string; phoneNumberId?: string; verifyToken?: string };
    instagram?: { accessToken?: string; appId?: string; verifyToken?: string };
  };

  if (channel === "whatsapp") {
    return {
      channel: "whatsapp",
      accessToken: integrations.whatsapp?.accessToken || requireConfigured(process.env.WHATSAPP_ACCESS_TOKEN, "WHATSAPP_ACCESS_TOKEN"),
      phoneNumberId:
        integrations.whatsapp?.phoneNumberId ||
        requireConfigured(process.env.WHATSAPP_PHONE_NUMBER_ID, "WHATSAPP_PHONE_NUMBER_ID")
    };
  }

  return {
    channel: "instagram",
    accessToken: integrations.instagram?.accessToken || requireConfigured(process.env.INSTAGRAM_ACCESS_TOKEN, "INSTAGRAM_ACCESS_TOKEN")
  };
}

export async function getMetaConfigForTenant(channel: Channel, tenantId?: string): Promise<ResolvedMetaConfig> {
  const integrations = await getIntegrations(tenantId) as {
    whatsapp?: { accessToken?: string; phoneNumberId?: string; verifyToken?: string };
    instagram?: { accessToken?: string; appId?: string; verifyToken?: string };
  };

  if (channel === "whatsapp") {
    return {
      channel: "whatsapp",
      accessToken: integrations.whatsapp?.accessToken || requireConfigured(process.env.WHATSAPP_ACCESS_TOKEN, "WHATSAPP_ACCESS_TOKEN"),
      phoneNumberId:
        integrations.whatsapp?.phoneNumberId ||
        requireConfigured(process.env.WHATSAPP_PHONE_NUMBER_ID, "WHATSAPP_PHONE_NUMBER_ID")
    };
  }

  return {
    channel: "instagram",
    accessToken: integrations.instagram?.accessToken || requireConfigured(process.env.INSTAGRAM_ACCESS_TOKEN, "INSTAGRAM_ACCESS_TOKEN")
  };
}

export async function sendMetaMessage(input: SendMessageInput) {
  const config = await getMetaConfig(input.channel);

  if (config.channel === "whatsapp") {
    return fetch(`https://graph.facebook.com/v22.0/${config.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.recipient,
        type: "text",
        text: { body: input.message }
      })
    });
  }

  return fetch("https://graph.facebook.com/v22.0/me/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipient: { id: input.recipient },
      message: { text: input.message }
    })
  });
}

export async function sendMetaMessageForTenant(input: SendMessageInput & { tenantId?: string }) {
  const config = await getMetaConfigForTenant(input.channel, input.tenantId);

  if (config.channel === "whatsapp") {
    return fetch(`https://graph.facebook.com/v22.0/${config.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.recipient,
        type: "text",
        text: { body: input.message }
      })
    });
  }

  return fetch("https://graph.facebook.com/v22.0/me/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipient: { id: input.recipient },
      message: { text: input.message }
    })
  });
}

export async function testMetaConnection(channel: Channel) {
  const config = await getMetaConfig(channel);
  const url =
    config.channel === "whatsapp"
      ? `https://graph.facebook.com/v22.0/${config.phoneNumberId}`
      : "https://graph.facebook.com/v22.0/me?fields=id,username";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.accessToken}`
    }
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

export async function testMetaConnectionForTenant(channel: Channel, tenantId?: string) {
  const config = await getMetaConfigForTenant(channel, tenantId);
  const url =
    config.channel === "whatsapp"
      ? `https://graph.facebook.com/v22.0/${config.phoneNumberId}`
      : "https://graph.facebook.com/v22.0/me?fields=id,username";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.accessToken}`
    }
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

export async function validateWebhook(mode: string | null, token: string | null, challenge: string | null) {
  let configuredToken: string | undefined;

  if (token && hasDatabaseUrl()) {
    const prisma = getPrismaClient();
    const configs = await prisma.integrationConfig.findMany({
      where: {
        channel: {
          in: ["whatsapp", "instagram"]
        }
      }
    });

    configuredToken = (configs as Array<{ configJson: string }>)
      .map((config) => {
        try {
          const parsed = JSON.parse(config.configJson) as { verifyToken?: string };
          return parsed.verifyToken;
        } catch {
          return undefined;
        }
      })
      .find((verifyToken) => verifyToken && verifyToken === token);
  }

  if (!configuredToken) {
    const integrations = await getIntegrations() as {
      whatsapp?: { verifyToken?: string };
      instagram?: { verifyToken?: string };
    };

    configuredToken =
      integrations.whatsapp?.verifyToken ||
      integrations.instagram?.verifyToken ||
      process.env.META_VERIFY_TOKEN;
  }

  if (mode === "subscribe" && token && configuredToken && token === configuredToken) {
    return challenge;
  }

  return null;
}
