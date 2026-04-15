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
    nodeKind?: string;
    nodeKindLabel?: string;
    category?: "trigger" | "action" | "logic" | "data";
    channel?: string;
    triggerType?: AutomationDetails["triggerType"];
    keyword?: string;
    message?: string;
    quickReplies?: string;
    mediaType?: string;
    mediaUrl?: string;
    delayMinutes?: number;
    condition?: string;
    actionType?: AutomationDetails["actionType"];
    variableName?: string;
    variableValue?: string;
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

export type ExecutionDebugStep = {
  id: string;
  label: string;
  type: string;
  status: "success" | "waiting" | "error" | "skipped";
  input: string;
  output: string;
  durationMs: number;
};

function nodeDebugLabel(type: FlowCanvasNodeType) {
  const labels: Record<FlowCanvasNodeType, string> = {
    entry: "Entrada",
    message: "Mensagem",
    wait: "Espera",
    condition: "Condição",
    action: "Ação"
  };

  return labels[type];
}

export function buildExecutionDebugSteps(input: {
  trigger?: string;
  preview: string;
  status: string;
  channel: string;
  contactName: string;
}) {
  const visual = input.trigger ? decodeVisualTrigger(input.trigger) : null;
  const hasError = input.status.includes("error") || input.status.includes("failed");

  if (!visual) {
    return [
      {
        id: "legacy-entry",
        label: "Evento recebido",
        type: "Entrada",
        status: "success" as const,
        input: `${input.channel} · ${input.contactName}`,
        output: "Fluxo simples localizado",
        durationMs: 42
      },
      {
        id: "legacy-message",
        label: "Mensagem enviada",
        type: "Mensagem",
        status: hasError ? ("error" as const) : ("success" as const),
        input: "Template principal",
        output: input.preview,
        durationMs: hasError ? 980 : 241
      }
    ];
  }

  const path = visual.linearPath.length ? visual.linearPath : visual.nodes.map((node) => node.id);
  const nodes = path.map((id) => visual.nodes.find((node) => node.id === id)).filter((node): node is FlowCanvasNode => Boolean(node));

  return nodes.map((node, index) => {
    const isLast = index === nodes.length - 1;
    const status = hasError && isLast ? "error" : node.type === "wait" ? "waiting" : "success";
    const label = node.data.nodeKindLabel || node.data.label || nodeDebugLabel(node.type);

    return {
      id: node.id,
      label,
      type: nodeDebugLabel(node.type),
      status,
      input:
        node.type === "entry"
          ? `${node.data.channel || input.channel} · ${node.data.keyword || "nova mensagem"}`
          : node.type === "condition"
            ? node.data.condition || "regra sem condição"
            : "Saída do bloco anterior",
      output:
        node.type === "message"
          ? node.data.message || input.preview
          : node.type === "wait"
            ? `${node.data.delayMinutes || 0} min de espera`
            : node.type === "action"
              ? node.data.actionType || "ação executada"
              : status === "error"
                ? "Falha no provedor ou configuração"
                : "Processado",
      durationMs: 70 + index * 86
    };
  });
}
