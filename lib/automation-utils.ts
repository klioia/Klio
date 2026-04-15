export type FlowChannel = "instagram" | "whatsapp" | "messenger" | "telegram" | "multi";

export type AutomationDetails = {
  triggerType: "keyword" | "new_message" | "pix_pending";
  keyword?: string;
  actionType: "reply_same_channel" | "handoff_whatsapp" | "notify_team";
  secondMessage?: string;
  delayMinutes?: number;
};

export function encodeTrigger(details: AutomationDetails) {
  return JSON.stringify(details);
}

export function decodeTrigger(trigger: string): AutomationDetails {
  try {
    const parsed = JSON.parse(trigger) as Partial<AutomationDetails>;

    return {
      triggerType: parsed.triggerType === "pix_pending" || parsed.triggerType === "new_message" ? parsed.triggerType : "keyword",
      keyword: parsed.keyword ?? "",
      actionType:
        parsed.actionType === "notify_team" || parsed.actionType === "handoff_whatsapp"
          ? parsed.actionType
          : "reply_same_channel",
      secondMessage: parsed.secondMessage ?? "",
      delayMinutes: Number(parsed.delayMinutes ?? 0)
    };
  } catch {
    return {
      triggerType: "keyword",
      keyword: trigger,
      actionType: "reply_same_channel",
      secondMessage: "",
      delayMinutes: 0
    };
  }
}

export function humanizeTrigger(trigger: string) {
  const details = decodeTrigger(trigger);

  if (details.triggerType === "new_message") {
    return "Nova mensagem recebida";
  }

  if (details.triggerType === "pix_pending") {
    return "Pix pendente";
  }

  return details.keyword ? `Palavra-chave: ${details.keyword}` : "Palavra-chave";
}

export function humanizeAction(trigger: string) {
  const details = decodeTrigger(trigger);

  if (details.actionType === "handoff_whatsapp") {
    return "Mover para WhatsApp";
  }

  if (details.actionType === "notify_team") {
    return "Notificar equipe";
  }

  return "Responder no mesmo canal";
}

export function compileMessage(template: string, contactName?: string) {
  return template.replaceAll("{{nome}}", contactName || "cliente");
}

export function describeFlow(trigger: string) {
  const details = decodeTrigger(trigger);
  const extras: string[] = [];

  if (details.secondMessage) {
    extras.push(`segunda etapa em ${details.delayMinutes || 0} min`);
  }

  return extras.length ? extras.join(" - ") : "Fluxo simples";
}
