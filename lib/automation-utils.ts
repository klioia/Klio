export type FlowChannel = "instagram" | "whatsapp" | "messenger" | "telegram" | "multi";

export type AutomationDetails = {
  triggerType: "keyword" | "new_message" | "pix_pending";
  keyword?: string;
  actionType: "reply_same_channel" | "handoff_whatsapp" | "notify_team";
  secondMessage?: string;
  delayMinutes?: number;
};

export type FlowCanvasNodeType = "entry" | "message" | "wait" | "condition" | "action";

export type FlowCanvasNode = {
  id: string;
  type: FlowCanvasNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    channel?: string;
    triggerType?: AutomationDetails["triggerType"];
    keyword?: string;
    message?: string;
    delayMinutes?: number;
    condition?: string;
    actionType?: AutomationDetails["actionType"];
  };
};

export type FlowCanvasEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type VisualAutomationTrigger = {
  version: 2;
  nodes: FlowCanvasNode[];
  edges: FlowCanvasEdge[];
  entryNodeId: string;
  linearPath: string[];
  legacyFallback: AutomationDetails;
};

export type EncodedAutomationTrigger = AutomationDetails | VisualAutomationTrigger;

function isVisualAutomationTrigger(value: unknown): value is VisualAutomationTrigger {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as { version?: unknown }).version === 2 &&
      Array.isArray((value as { nodes?: unknown }).nodes) &&
      Array.isArray((value as { edges?: unknown }).edges)
  );
}

export function encodeTrigger(details: EncodedAutomationTrigger) {
  return JSON.stringify(details);
}

export function decodeVisualTrigger(trigger: string): VisualAutomationTrigger | null {
  try {
    const parsed = JSON.parse(trigger) as unknown;
    return isVisualAutomationTrigger(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function decodeTrigger(trigger: string): AutomationDetails {
  try {
    const parsed = JSON.parse(trigger) as Partial<AutomationDetails> | VisualAutomationTrigger;

    if (isVisualAutomationTrigger(parsed)) {
      return {
        triggerType: parsed.legacyFallback.triggerType ?? "keyword",
        keyword: parsed.legacyFallback.keyword ?? "",
        actionType: parsed.legacyFallback.actionType ?? "reply_same_channel",
        secondMessage: parsed.legacyFallback.secondMessage ?? "",
        delayMinutes: Number(parsed.legacyFallback.delayMinutes ?? 0)
      };
    }

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
  const visual = decodeVisualTrigger(trigger);

  if (visual) {
    const entry = visual.nodes.find((node) => node.id === visual.entryNodeId || node.type === "entry");
    const channel = entry?.data.channel ? ` em ${entry.data.channel}` : "";
    const keyword = visual.legacyFallback.keyword ? `: ${visual.legacyFallback.keyword}` : "";
    return visual.legacyFallback.triggerType === "new_message" ? `Nova mensagem${channel}` : `Entrada visual${keyword}`;
  }

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
  const visual = decodeVisualTrigger(trigger);

  if (visual) {
    const action = visual.nodes.find((node) => node.type === "action");

    if (action?.data.actionType === "handoff_whatsapp") {
      return "Levar para WhatsApp";
    }

    if (action?.data.actionType === "notify_team") {
      return "Avisar equipe";
    }

    return "Responder no canal";
  }

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
  const visual = decodeVisualTrigger(trigger);

  if (visual) {
    const steps = visual.linearPath
      .map((id) => visual.nodes.find((node) => node.id === id)?.type)
      .filter(Boolean);

    return steps.length ? `${steps.length} blocos conectados` : "Fluxo visual";
  }

  const details = decodeTrigger(trigger);
  const extras: string[] = [];

  if (details.secondMessage) {
    extras.push(`segunda etapa em ${details.delayMinutes || 0} min`);
  }

  return extras.length ? extras.join(" - ") : "Fluxo simples";
}
