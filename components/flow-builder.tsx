"use client";

import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps
} from "@xyflow/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AutomationDetails,
  FlowCanvasEdge,
  FlowCanvasNode,
  FlowCanvasNodeType,
  VisualAutomationTrigger,
  decodeTrigger,
  decodeVisualTrigger
} from "@/lib/automation-utils";

type AutomationItem = {
  id: string;
  name: string;
  channel: string;
  trigger: string;
  status: string;
  message: string;
};

type FlowBuilderProps = {
  initialAutomations: AutomationItem[];
};

type FlowNodeData = {
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

type StudioNode = Node<FlowNodeData, FlowCanvasNodeType>;
type StudioEdge = Edge<{ label?: string }>;

type Template = {
  id: string;
  title: string;
  subtitle: string;
  nodes: StudioNode[];
  edges: StudioEdge[];
};

type NodePaletteItem = {
  id: string;
  label: string;
  description: string;
  category: FlowNodeData["category"];
  baseType: FlowCanvasNodeType;
  icon: string;
  data: FlowNodeData;
};

const channelOptions = [
  { id: "instagram", label: "Instagram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "messenger", label: "Messenger" },
  { id: "telegram", label: "Telegram" },
  { id: "multi", label: "Multicanal" }
];

const triggerOptions = [
  { id: "keyword", label: "Palavra-chave" },
  { id: "new_message", label: "Nova mensagem" }
];

const actionOptions = [
  { id: "reply_same_channel", label: "Responder no canal" },
  { id: "handoff_whatsapp", label: "Levar para WhatsApp" },
  { id: "notify_team", label: "Avisar equipe" }
];

const nodePalette: { title: string; items: NodePaletteItem[] }[] = [
  {
    title: "Triggers",
    items: [
      {
        id: "incoming-message",
        label: "Mensagem recebida",
        description: "Inicia quando alguém chama em um canal.",
        category: "trigger",
        baseType: "entry",
        icon: "IN",
        data: { label: "Mensagem recebida", nodeKind: "incoming_message", nodeKindLabel: "Mensagem recebida", category: "trigger", channel: "whatsapp", triggerType: "new_message" }
      },
      {
        id: "new-lead",
        label: "Novo lead",
        description: "Entrada vinda de anúncio, formulário ou campanha.",
        category: "trigger",
        baseType: "entry",
        icon: "LEAD",
        data: { label: "Novo lead", nodeKind: "new_lead", nodeKindLabel: "Novo lead", category: "trigger", channel: "multi", triggerType: "keyword", keyword: "lead" }
      },
      {
        id: "webhook-received",
        label: "Webhook recebido",
        description: "Recebe evento de outra ferramenta.",
        category: "trigger",
        baseType: "entry",
        icon: "API",
        data: { label: "Webhook recebido", nodeKind: "webhook_received", nodeKindLabel: "Webhook recebido", category: "trigger", channel: "multi", triggerType: "keyword", keyword: "webhook" }
      }
    ]
  },
  {
    title: "Ações",
    items: [
      {
        id: "send-message",
        label: "Enviar mensagem",
        description: "Texto com variáveis, respostas rápidas e atraso.",
        category: "action",
        baseType: "message",
        icon: "MSG",
        data: { label: "Enviar mensagem", nodeKind: "send_message", nodeKindLabel: "Enviar mensagem", category: "action", message: "Olá {{nome}}, posso te ajudar agora.", quickReplies: "Quero saber mais, Falar com atendente" }
      },
      {
        id: "send-media",
        label: "Enviar mídia",
        description: "Imagem, áudio, vídeo ou documento.",
        category: "action",
        baseType: "message",
        icon: "MID",
        data: { label: "Enviar mídia", nodeKind: "send_media", nodeKindLabel: "Enviar mídia", category: "action", message: "Separei este material para você, {{nome}}.", mediaType: "imagem", mediaUrl: "" }
      },
      {
        id: "notify-team",
        label: "Notificar equipe",
        description: "Avisa vendedor ou suporte com contexto.",
        category: "action",
        baseType: "action",
        icon: "TEAM",
        data: { label: "Notificar equipe", nodeKind: "notify_team", nodeKindLabel: "Notificar equipe", category: "action", actionType: "notify_team", message: "Lead quente aguardando atendimento." }
      },
      {
        id: "wait",
        label: "Esperar",
        description: "Pausa antes da próxima etapa.",
        category: "action",
        baseType: "wait",
        icon: "WAIT",
        data: { label: "Esperar", nodeKind: "wait", nodeKindLabel: "Esperar", category: "action", delayMinutes: 5 }
      }
    ]
  },
  {
    title: "Lógica",
    items: [
      {
        id: "if-else",
        label: "If/else",
        description: "Divide o caminho por condição simples.",
        category: "logic",
        baseType: "condition",
        icon: "IF",
        data: { label: "If/else", nodeKind: "if_else", nodeKindLabel: "If/else", category: "logic", condition: "contém preço" }
      },
      {
        id: "filter",
        label: "Filtro",
        description: "Continua apenas quando a regra bater.",
        category: "logic",
        baseType: "condition",
        icon: "FLT",
        data: { label: "Filtro", nodeKind: "filter", nodeKindLabel: "Filtro", category: "logic", condition: "canal é WhatsApp" }
      },
      {
        id: "route-channel",
        label: "Roteamento",
        description: "Escolhe caminho por canal ou origem.",
        category: "logic",
        baseType: "condition",
        icon: "RT",
        data: { label: "Roteamento por canal", nodeKind: "route_channel", nodeKindLabel: "Roteamento", category: "logic", condition: "origem do lead" }
      }
    ]
  },
  {
    title: "Dados",
    items: [
      {
        id: "set-variable",
        label: "Setar variável",
        description: "Guarda nome, origem, score ou campo do lead.",
        category: "data",
        baseType: "action",
        icon: "VAR",
        data: { label: "Setar variável", nodeKind: "set_variable", nodeKindLabel: "Setar variável", category: "data", actionType: "reply_same_channel", variableName: "origem_lead", variableValue: "instagram" }
      },
      {
        id: "json-parser",
        label: "JSON parser",
        description: "Lê dados vindos de API ou webhook.",
        category: "data",
        baseType: "action",
        icon: "JSON",
        data: { label: "JSON parser", nodeKind: "json_parser", nodeKindLabel: "JSON parser", category: "data", actionType: "reply_same_channel", variableName: "payload", variableValue: "{{evento}}" }
      }
    ]
  }
];

const variableTokens = ["{{nome}}", "{{telefone}}", "{{origem_lead}}", "{{ultima_compra}}", "{{atendente}}"];

const nodeTypeMeta: Record<FlowCanvasNodeType, { label: string; icon: string; tone: string }> = {
  entry: { label: "Entrada", icon: "IN", tone: "entry" },
  message: { label: "Mensagem", icon: "MSG", tone: "message" },
  wait: { label: "Espera", icon: "WAIT", tone: "wait" },
  condition: { label: "Condição", icon: "IF", tone: "condition" },
  action: { label: "Ação", icon: "GO", tone: "action" }
};

function channelLabel(channel?: string) {
  return channelOptions.find((item) => item.id === channel)?.label || "Multicanal";
}

function triggerLabel(triggerType?: string, keyword?: string) {
  if (triggerType === "new_message") {
    return "Nova mensagem recebida";
  }

  return keyword ? `Palavra-chave "${keyword}"` : "Palavra-chave";
}

function actionLabel(actionType?: string) {
  return actionOptions.find((item) => item.id === actionType)?.label || "Responder no canal";
}

function createEdge(source: string, target: string, label?: string): StudioEdge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    label,
    type: "smoothstep",
    animated: true,
    className: "flow-studio-edge"
  };
}

function node(id: string, type: FlowCanvasNodeType, x: number, y: number, data: FlowNodeData): StudioNode {
  return {
    id,
    type,
    position: { x, y },
    data,
    className: `flow-studio-node-shell flow-studio-node-${type}`
  };
}

const templates: Template[] = [
  {
    id: "lead",
    title: "Instagram para WhatsApp",
    subtitle: "Comentário vira DM, qualificação e repasse para fechamento.",
    nodes: [
      node("entry-1", "entry", 0, 80, {
        label: "Comentário no Instagram",
        channel: "instagram",
        triggerType: "keyword",
        keyword: "quero"
      }),
      node("message-1", "message", 310, 40, {
        label: "Resposta de qualificação",
        message: "Oi, vi seu interesse e posso te ajudar por aqui. Me conte rapidamente o que você quer automatizar primeiro."
      }),
      node("wait-1", "wait", 620, 80, {
        label: "Aguardar contexto",
        delayMinutes: 10
      }),
      node("action-1", "action", 920, 40, {
        label: "Enviar para WhatsApp",
        actionType: "handoff_whatsapp",
        message: "Perfeito. Agora vou te encaminhar para um especialista com todo o contexto da conversa."
      })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "wait-1"), createEdge("wait-1", "action-1")]
  },
  {
    id: "support",
    title: "Atendimento inicial",
    subtitle: "Primeira resposta automática e organização do pedido.",
    nodes: [
      node("entry-1", "entry", 0, 80, {
        label: "Nova mensagem",
        channel: "whatsapp",
        triggerType: "new_message",
        keyword: ""
      }),
      node("message-1", "message", 310, 80, {
        label: "Boas-vindas",
        message: "Olá. Recebi sua mensagem e já vou te ajudar. Me diga em uma frase o que você precisa agora."
      }),
      node("action-1", "action", 620, 80, {
        label: "Responder no canal",
        actionType: "reply_same_channel",
        message: "Se preferir, também posso repassar seu atendimento para uma pessoa da equipe."
      })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "action-1")]
  },
  {
    id: "team-alert",
    title: "Avisar equipe",
    subtitle: "Quando aparecer oportunidade, a equipe recebe contexto.",
    nodes: [
      node("entry-1", "entry", 0, 80, {
        label: "Pedido de orçamento",
        channel: "multi",
        triggerType: "keyword",
        keyword: "orçamento"
      }),
      node("condition-1", "condition", 310, 80, {
        label: "Contém intenção",
        condition: "orçamento, preço, proposta"
      }),
      node("message-1", "message", 620, 40, {
        label: "Confirmação ao cliente",
        message: "Recebi seu pedido e a equipe já foi avisada para continuar o atendimento."
      }),
      node("action-1", "action", 920, 80, {
        label: "Notificar equipe",
        actionType: "notify_team"
      })
    ],
    edges: [
      createEdge("entry-1", "condition-1"),
      createEdge("condition-1", "message-1", "sim"),
      createEdge("message-1", "action-1")
    ]
  }
];

function cloneTemplate(template: Template) {
  return {
    nodes: template.nodes.map((item) => ({ ...item, data: { ...item.data }, position: { ...item.position } })),
    edges: template.edges.map((item) => ({ ...item, data: item.data ? { ...item.data } : undefined }))
  };
}

type FlowDraft = {
  name: string;
  status: string;
  nodes: StudioNode[];
  edges: StudioEdge[];
  updatedAt: string;
  version: number;
};

type FlowSnapshot = Pick<FlowDraft, "nodes" | "edges">;

const draftStorageKey = "klio-flow-studio-draft-v2";

function readLocalDraft(): FlowDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(draftStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FlowDraft;
    return Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) ? parsed : null;
  } catch {
    return null;
  }
}

function snapshotFlow(nodes: StudioNode[], edges: StudioEdge[]): FlowSnapshot {
  return {
    nodes: nodes.map((item) => ({ ...item, data: { ...item.data }, position: { ...item.position } })),
    edges: edges.map((item) => ({ ...item, data: item.data ? { ...item.data } : undefined }))
  };
}

function createNodeFromPalette(item: NodePaletteItem, count: number): StudioNode {
  const id = `${item.baseType}-${item.id}-${Date.now()}`;
  const position = { x: 140 + count * 38, y: 130 + count * 30 };
  return node(id, item.baseType, position.x, position.y, { ...item.data });
}

function getLinearPath(nodes: StudioNode[], edges: StudioEdge[]) {
  const entry = nodes.find((item) => item.type === "entry");
  if (!entry) return [];

  const path = [entry.id];
  const visited = new Set(path);
  let current = entry.id;

  while (true) {
    const nextEdge = edges.find((edge) => edge.source === current && !visited.has(edge.target));
    if (!nextEdge) break;
    path.push(nextEdge.target);
    visited.add(nextEdge.target);
    current = nextEdge.target;
  }

  return path;
}

function getFallback(nodes: StudioNode[], edges: StudioEdge[]): AutomationDetails {
  const path = getLinearPath(nodes, edges);
  const orderedNodes = path.map((id) => nodes.find((item) => item.id === id)).filter((item): item is StudioNode => Boolean(item));
  const entry = orderedNodes.find((item) => item.type === "entry") || nodes.find((item) => item.type === "entry");
  const action = [...orderedNodes].reverse().find((item) => item.type === "action") || nodes.find((item) => item.type === "action");
  const wait = orderedNodes.find((item) => item.type === "wait") || nodes.find((item) => item.type === "wait");

  return {
    triggerType: entry?.data.triggerType === "new_message" ? "new_message" : "keyword",
    keyword: entry?.data.keyword || "",
    actionType: action?.data.actionType || "reply_same_channel",
    secondMessage: typeof action?.data.message === "string" ? action.data.message : "",
    delayMinutes: Number(wait?.data.delayMinutes || 0)
  };
}

function validateFlow(nodes: StudioNode[], edges: StudioEdge[]) {
  const issues: string[] = [];
  const entry = nodes.find((item) => item.type === "entry");
  const message = nodes.find((item) => item.type === "message" && String(item.data.message || "").trim());
  const path = getLinearPath(nodes, edges);

  if (!entry) issues.push("Adicione um bloco de entrada.");
  if (!message) issues.push("Adicione pelo menos uma mensagem com texto.");
  if (entry && path.length < 2) issues.push("Conecte a entrada ao próximo bloco.");
  if (entry && message && !path.includes(message.id)) issues.push("A mensagem precisa estar conectada ao caminho principal.");

  return { issues, valid: issues.length === 0, path };
}

function toCanvasTrigger(nodes: StudioNode[], edges: StudioEdge[]): VisualAutomationTrigger {
  const fallback = getFallback(nodes, edges);
  const linearPath = getLinearPath(nodes, edges);
  const entry = nodes.find((item) => item.type === "entry");

  return {
    version: 2,
    nodes: nodes.map((item): FlowCanvasNode => ({
      id: item.id,
      type: item.type || "message",
      position: item.position,
      data: {
        label: item.data.label,
        nodeKind: item.data.nodeKind,
        nodeKindLabel: item.data.nodeKindLabel,
        category: item.data.category,
        channel: item.data.channel,
        triggerType: item.data.triggerType,
        keyword: item.data.keyword,
        message: item.data.message,
        quickReplies: item.data.quickReplies,
        mediaType: item.data.mediaType,
        mediaUrl: item.data.mediaUrl,
        delayMinutes: item.data.delayMinutes,
        condition: item.data.condition,
        actionType: item.data.actionType,
        variableName: item.data.variableName,
        variableValue: item.data.variableValue
      }
    })),
    edges: edges.map((item): FlowCanvasEdge => ({
      id: item.id,
      source: item.source,
      target: item.target,
      label: typeof item.label === "string" ? item.label : undefined
    })),
    entryNodeId: entry?.id || linearPath[0] || "",
    linearPath,
    legacyFallback: fallback
  };
}

function fromVisualTrigger(trigger: VisualAutomationTrigger) {
  return {
    nodes: trigger.nodes.map((item): StudioNode => ({
      id: item.id,
      type: item.type,
      position: item.position,
      data: item.data,
      className: `flow-studio-node-shell flow-studio-node-${item.type}`
    })),
    edges: trigger.edges.map((item): StudioEdge => ({
      id: item.id,
      source: item.source,
      target: item.target,
      label: item.label,
      type: "smoothstep",
      animated: true,
      className: "flow-studio-edge"
    }))
  };
}

function getPrimaryMessage(nodes: StudioNode[], edges: StudioEdge[]) {
  const path = getLinearPath(nodes, edges);
  const messageNode = path
    .map((id) => nodes.find((item) => item.id === id))
    .find((item) => item?.type === "message");

  return String(messageNode?.data.message || "Mensagem automática da Klio.");
}

function nodeSummary(nodeItem: Pick<StudioNode, "type" | "data">) {
  if (nodeItem.type === "entry") return `${channelLabel(nodeItem.data.channel)} · ${triggerLabel(nodeItem.data.triggerType, nodeItem.data.keyword)}`;
  if (nodeItem.type === "message") return String(nodeItem.data.message || "Mensagem sem texto");
  if (nodeItem.type === "wait") return `${nodeItem.data.delayMinutes || 0} min antes da próxima etapa`;
  if (nodeItem.type === "condition") return `Se contém: ${nodeItem.data.condition || "termo"}`;
  return actionLabel(nodeItem.data.actionType);
}

function nodeSummaryRich(nodeItem: Pick<StudioNode, "type" | "data">) {
  if (nodeItem.type === "message") {
    const media = nodeItem.data.mediaType ? ` · midia: ${nodeItem.data.mediaType}` : "";
    return `${String(nodeItem.data.message || "Mensagem sem texto")}${media}`;
  }

  if (nodeItem.data.nodeKind === "set_variable") return `${nodeItem.data.variableName || "variavel"} = ${nodeItem.data.variableValue || "valor"}`;
  if (nodeItem.data.nodeKind === "json_parser") return `Ler payload em ${nodeItem.data.variableName || "variavel"}`;

  return nodeSummary(nodeItem);
}

function FlowNodeCard(props: NodeProps<StudioNode>) {
  const meta = nodeTypeMeta[props.type || "message"];

  return (
    <div className={`flow-node-card flow-node-card-${meta.tone}${props.selected ? " flow-node-card-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-node-handle" />
      <div className="flow-node-card-head">
        <span>{meta.icon}</span>
        <div>
          <strong>{props.data.label}</strong>
          <small>{props.data.nodeKindLabel || meta.label}</small>
        </div>
      </div>
      {props.data.category ? <span className={`flow-node-kind flow-node-kind-${props.data.category}`}>{props.data.category}</span> : null}
      <p>{nodeSummaryRich({ type: props.type || "message", data: props.data })}</p>
      <Handle type="source" position={Position.Right} className="flow-node-handle" />
    </div>
  );
}

const nodeTypes = {
  entry: FlowNodeCard,
  message: FlowNodeCard,
  wait: FlowNodeCard,
  condition: FlowNodeCard,
  action: FlowNodeCard
};

function FlowToolbar({
  onAdd,
  onDuplicate,
  onUndo,
  onRedo,
  canDuplicate,
  canUndo,
  canRedo
}: {
  onAdd: (item: NodePaletteItem) => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canDuplicate: boolean;
  canUndo: boolean;
  canRedo: boolean;
}) {
  return (
    <div className="flow-canvas-toolbar">
      <div className="flow-toolbar-actions">
        <button disabled={!canUndo} type="button" onClick={onUndo}>
          Desfazer
        </button>
        <button disabled={!canRedo} type="button" onClick={onRedo}>
          Refazer
        </button>
        <button disabled={!canDuplicate} type="button" onClick={onDuplicate}>
          Duplicar bloco
        </button>
      </div>
      {nodePalette.map((group) => (
        <div className="flow-toolbar-group" key={group.title}>
          <strong>{group.title}</strong>
          <div>
            {group.items.map((item) => (
              <button key={item.id} title={item.description} type="button" onClick={() => onAdd(item)}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowValidationPanel({ issues, valid }: { issues: string[]; valid: boolean }) {
  return (
    <div className={`flow-validation-panel${valid ? " flow-validation-panel-ok" : ""}`}>
      <strong>{valid ? "Fluxo pronto para publicar" : "Ajustes necessários"}</strong>
      {valid ? (
        <p>Entrada, mensagem e caminho principal estão conectados.</p>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NodeInspector({
  nodeItem,
  onUpdate
}: {
  nodeItem: StudioNode | null;
  onUpdate: (id: string, data: Partial<FlowNodeData>) => void;
}) {
  if (!nodeItem) {
    return (
      <section className="flow-inspector-panel">
        <span className="workspace-kicker">Inspector</span>
        <h3>Selecione um bloco</h3>
        <p className="mini">Clique em qualquer bloco no canvas para editar canal, texto, condição ou ação.</p>
      </section>
    );
  }

  return (
    <section className="flow-inspector-panel">
      <span className="workspace-kicker">{nodeTypeMeta[nodeItem.type || "message"].label}</span>
      <label className="flow-field">
        <span>Nome do bloco</span>
        <input className="input" value={nodeItem.data.label} onChange={(event) => onUpdate(nodeItem.id, { label: event.target.value })} />
      </label>

      {nodeItem.type === "entry" ? (
        <>
          <label className="flow-field">
            <span>Canal</span>
            <select className="select" value={nodeItem.data.channel || "instagram"} onChange={(event) => onUpdate(nodeItem.id, { channel: event.target.value })}>
              {channelOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flow-field">
            <span>Gatilho</span>
            <select
              className="select"
              value={nodeItem.data.triggerType || "keyword"}
              onChange={(event) => onUpdate(nodeItem.id, { triggerType: event.target.value as AutomationDetails["triggerType"] })}
            >
              {triggerOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flow-field">
            <span>Palavra-chave</span>
            <input className="input" value={nodeItem.data.keyword || ""} onChange={(event) => onUpdate(nodeItem.id, { keyword: event.target.value })} />
          </label>
        </>
      ) : null}

      {nodeItem.type === "message" ? (
        <>
          <label className="flow-field">
            <span>Mensagem enviada pela Klio</span>
            <textarea className="textarea flow-message-box" value={nodeItem.data.message || ""} onChange={(event) => onUpdate(nodeItem.id, { message: event.target.value })} />
          </label>
          <div className="flow-variable-row">
            {variableTokens.map((token) => (
              <button key={token} type="button" onClick={() => onUpdate(nodeItem.id, { message: `${nodeItem.data.message || ""} ${token}`.trim() })}>
                {token}
              </button>
            ))}
          </div>
          <label className="flow-field">
            <span>Respostas rápidas</span>
            <input className="input" placeholder="Sim, quero | Falar com equipe" value={nodeItem.data.quickReplies || ""} onChange={(event) => onUpdate(nodeItem.id, { quickReplies: event.target.value })} />
          </label>
          <div className="flow-two-columns">
            <label className="flow-field">
              <span>Tipo de mídia</span>
              <select className="select" value={nodeItem.data.mediaType || ""} onChange={(event) => onUpdate(nodeItem.id, { mediaType: event.target.value })}>
                <option value="">Sem mídia</option>
                <option value="imagem">Imagem</option>
                <option value="audio">Áudio</option>
                <option value="video">Vídeo</option>
                <option value="documento">Documento</option>
              </select>
            </label>
            <label className="flow-field">
              <span>URL da mídia</span>
              <input className="input" placeholder="https://" value={nodeItem.data.mediaUrl || ""} onChange={(event) => onUpdate(nodeItem.id, { mediaUrl: event.target.value })} />
            </label>
          </div>
        </>
      ) : null}

      {nodeItem.type === "wait" ? (
        <label className="flow-field">
          <span>Tempo de espera em minutos</span>
          <input className="input" inputMode="numeric" value={nodeItem.data.delayMinutes || 0} onChange={(event) => onUpdate(nodeItem.id, { delayMinutes: Number(event.target.value || 0) })} />
        </label>
      ) : null}

      {nodeItem.type === "condition" ? (
        <label className="flow-field">
          <span>Condição simples</span>
          <input className="input" value={nodeItem.data.condition || ""} onChange={(event) => onUpdate(nodeItem.id, { condition: event.target.value })} />
        </label>
      ) : null}

      {nodeItem.type === "action" ? (
        <>
          <label className="flow-field">
            <span>Ação final</span>
            <select
              className="select"
              value={nodeItem.data.actionType || "reply_same_channel"}
              onChange={(event) => onUpdate(nodeItem.id, { actionType: event.target.value as AutomationDetails["actionType"] })}
            >
              {actionOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flow-field">
            <span>Mensagem de continuação</span>
            <textarea className="textarea flow-message-box-small" value={nodeItem.data.message || ""} onChange={(event) => onUpdate(nodeItem.id, { message: event.target.value })} />
          </label>
          {nodeItem.data.category === "data" ? (
            <div className="flow-two-columns">
              <label className="flow-field">
                <span>Variável</span>
                <input className="input" value={nodeItem.data.variableName || ""} onChange={(event) => onUpdate(nodeItem.id, { variableName: event.target.value })} />
              </label>
              <label className="flow-field">
                <span>Valor</span>
                <input className="input" value={nodeItem.data.variableValue || ""} onChange={(event) => onUpdate(nodeItem.id, { variableValue: event.target.value })} />
              </label>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export function FlowBuilder({ initialAutomations }: FlowBuilderProps) {
  const bootDraft = useMemo(() => readLocalDraft(), []);
  const initialTemplate = useMemo(() => cloneTemplate(templates[0]), []);
  const [automations, setAutomations] = useState(initialAutomations);
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(bootDraft?.nodes || initialTemplate.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StudioEdge>(bootDraft?.edges || initialTemplate.edges);
  const [name, setName] = useState("Qualificação automática de lead");
  const [status, setStatus] = useState(bootDraft?.status || "Ativa");
  const [activeTemplate, setActiveTemplate] = useState("lead");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>((bootDraft?.nodes || initialTemplate.nodes)[0]?.id || null);
  const [statusText, setStatusText] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");
  const [history, setHistory] = useState<FlowSnapshot[]>([]);
  const [future, setFuture] = useState<FlowSnapshot[]>([]);
  const [draftVersion, setDraftVersion] = useState(bootDraft?.version || 1);
  const [autosaveLabel, setAutosaveLabel] = useState(bootDraft ? "Rascunho local restaurado" : "Rascunho local pronto");

  const selectedNode = useMemo(() => nodes.find((item) => item.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const validation = useMemo(() => validateFlow(nodes, edges), [edges, nodes]);
  const fallback = useMemo(() => getFallback(nodes, edges), [edges, nodes]);
  const primaryMessage = useMemo(() => getPrimaryMessage(nodes, edges), [edges, nodes]);
  const selectedAutomation = useMemo(() => automations.find((item) => item.id === testingId) || null, [automations, testingId]);
  const selectedAutomationDetails = useMemo(() => (selectedAutomation ? decodeTrigger(selectedAutomation.trigger) : null), [selectedAutomation]);

  const previewSteps = useMemo(() => {
    const path = getLinearPath(nodes, edges);
    return path.map((id) => nodes.find((item) => item.id === id)).filter((item): item is StudioNode => Boolean(item));
  }, [edges, nodes]);

  const savedFlowLabel = useMemo(() => {
    if (!selectedAutomation) return "";
    const visual = decodeVisualTrigger(selectedAutomation.trigger);
    if (visual) return `${visual.nodes.length} blocos visuais`;
    return triggerLabel(selectedAutomationDetails?.triggerType, selectedAutomationDetails?.keyword);
  }, [selectedAutomation, selectedAutomationDetails]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextVersion = draftVersion + 1;
      const updatedAt = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          name,
          status,
          nodes,
          edges,
          updatedAt,
          version: nextVersion
        })
      );
      setDraftVersion(nextVersion);
      setAutosaveLabel(`Rascunho local salvo às ${updatedAt}`);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [edges, name, nodes, status]);

  function rememberCurrent() {
    setHistory((current) => [...current.slice(-19), snapshotFlow(nodes, edges)]);
    setFuture([]);
  }

  function undoFlow() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setFuture((current) => [snapshotFlow(nodes, edges), ...current.slice(0, 19)]);
    setHistory((current) => current.slice(0, -1));
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setSelectedNodeId(previous.nodes[0]?.id || null);
    setStatusText("Alteração desfeita.");
  }

  function redoFlow() {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current.slice(-19), snapshotFlow(nodes, edges)]);
    setFuture((current) => current.slice(1));
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedNodeId(next.nodes[0]?.id || null);
    setStatusText("Alteração refeita.");
  }

  function applyTemplate(template: Template) {
    rememberCurrent();
    const next = cloneTemplate(template);
    setActiveTemplate(template.id);
    setNodes(next.nodes);
    setEdges(next.edges);
    setName(template.title);
    setStatus("Ativa");
    setSelectedNodeId(next.nodes[0]?.id || null);
    setStatusText(`Modelo aplicado: ${template.title}. Edite os blocos e publique quando estiver pronto.`);
  }

  function handleConnect(connection: Connection) {
    rememberCurrent();
    setEdges((current) => addEdge({ ...connection, type: "smoothstep", animated: true, className: "flow-studio-edge" }, current));
  }

  function handleAddNode(type: FlowCanvasNodeType) {
    const id = `${type}-${Date.now()}`;
    const position = { x: 140 + nodes.length * 40, y: 140 + nodes.length * 28 };
    const defaults: Record<FlowCanvasNodeType, FlowNodeData> = {
      entry: { label: "Nova entrada", channel: "whatsapp", triggerType: "new_message", keyword: "" },
      message: { label: "Nova mensagem", message: "Escreva a resposta da Klio aqui." },
      wait: { label: "Esperar", delayMinutes: 5 },
      condition: { label: "Condição", condition: "contém palavra-chave" },
      action: { label: "Ação final", actionType: "reply_same_channel", message: "" }
    };
    const nextNode = node(id, type, position.x, position.y, defaults[type]);
    setNodes((current) => [...current, nextNode]);
    setSelectedNodeId(id);
  }

  function handleAddPaletteNode(item: NodePaletteItem) {
    rememberCurrent();
    const nextNode = createNodeFromPalette(item, nodes.length);
    setNodes((current) => [...current, nextNode]);
    setSelectedNodeId(nextNode.id);
    setStatusText(`Bloco adicionado: ${item.label}.`);
  }

  function duplicateSelectedNode() {
    const selected = nodes.find((item) => item.id === selectedNodeId);
    if (!selected) return;

    rememberCurrent();
    const duplicateId = `${selected.type}-copy-${Date.now()}`;
    const duplicated: StudioNode = {
      ...selected,
      id: duplicateId,
      selected: true,
      position: { x: selected.position.x + 52, y: selected.position.y + 52 },
      data: { ...selected.data, label: `${selected.data.label} cópia` }
    };
    setNodes((current) => [...current.map((item) => ({ ...item, selected: false })), duplicated]);
    setSelectedNodeId(duplicateId);
    setStatusText("Bloco duplicado. Conecte a cópia no caminho desejado.");
  }

  function simulateCurrentFlow() {
    const readable = previewSteps.map((item) => item.data.nodeKindLabel || nodeTypeMeta[item.type || "message"].label).join(" → ");

    if (!validation.valid) {
      setStatusText(`Simulação em rascunho: ${readable || "adicione blocos"} · ajuste os alertas antes de publicar.`);
      return;
    }

    setStatusText(`Simulação local aprovada: ${readable}. Nada foi enviado ao cliente.`);
  }

  function updateNodeData(id: string, data: Partial<FlowNodeData>) {
    rememberCurrent();
    setNodes((current) => current.map((item) => (item.id === id ? { ...item, data: { ...item.data, ...data } } : item)));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedStatus = submitter?.value || status;
    const finalStatus = validation.valid ? requestedStatus : "Rascunho";
    const canvas = toCanvasTrigger(nodes, edges);

    setSaving(true);
    setStatus(finalStatus);
    setStatusText("");

    const response = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        channel: nodes.find((item) => item.type === "entry")?.data.channel || "multi",
        triggerType: canvas.legacyFallback.triggerType,
        keyword: canvas.legacyFallback.keyword,
        actionType: canvas.legacyFallback.actionType,
        secondMessage: canvas.legacyFallback.secondMessage,
        delayMinutes: canvas.legacyFallback.delayMinutes,
        status: finalStatus,
        message: primaryMessage,
        canvas
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatusText(data.error || "Não foi possível salvar o fluxo.");
      setSaving(false);
      return;
    }

    setAutomations((current) => [data.automation, ...current]);
    setTestingId(data.automation.id);
    setStatusText(
      validation.valid
        ? finalStatus === "Ativa"
          ? "Fluxo visual publicado e pronto para teste."
          : "Rascunho visual salvo para revisar depois."
        : "Fluxo incompleto salvo como rascunho. Revise os alertas antes de publicar."
    );
    setSaving(false);
  }

  async function handleTest() {
    if (!testingId) {
      setStatusText("Salve ou selecione um fluxo antes de testar.");
      return;
    }

    if (!testRecipient.trim()) {
      setStatusText("Informe um WhatsApp ou destino de teste para executar o fluxo.");
      return;
    }

    setTesting(true);
    setStatusText("Executando teste...");

    const response = await fetch("/api/automations/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        automationId: testingId,
        recipient: testRecipient,
        contactName: testContactName,
        channel: selectedAutomation?.channel || nodes.find((item) => item.type === "entry")?.data.channel || "whatsapp"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatusText(data.error || "Falha ao testar fluxo.");
      setTesting(false);
      return;
    }

    setStatusText(data.preview ? `Teste concluído: ${data.preview}` : "Fluxo executado com sucesso.");
    setTesting(false);
  }

  return (
    <section className="flow-studio">
      <form className="flow-studio-main" onSubmit={handleSave}>
        <div className="flow-studio-header">
          <div>
            <span className="workspace-kicker">Flow Studio visual</span>
            <h2>Construa automações como um mapa de conversa.</h2>
            <p>Arraste blocos, conecte etapas e publique um fluxo linear validado para WhatsApp, Instagram e outros canais.</p>
          </div>
          <div className="flow-studio-actions">
            <span className="flow-autosave-chip">v{draftVersion} · {autosaveLabel}</span>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} aria-label="Nome do fluxo" />
            <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Ativa">Ativa</option>
              <option value="Rascunho">Rascunho</option>
            </select>
          </div>
        </div>

        <div className="flow-template-strip">
          {templates.map((template) => (
            <button className={`flow-template-pill${activeTemplate === template.id ? " flow-template-pill-active" : ""}`} key={template.id} onClick={() => applyTemplate(template)} type="button">
              <strong>{template.title}</strong>
              <span>{template.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="flow-canvas-shell">
          <FlowToolbar
            canDuplicate={Boolean(selectedNode)}
            canRedo={future.length > 0}
            canUndo={history.length > 0}
            onAdd={handleAddPaletteNode}
            onDuplicate={duplicateSelectedNode}
            onRedo={redoFlow}
            onUndo={undoFlow}
          />
          <ReactFlow<StudioNode, StudioEdge>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={(_, clickedNode) => setSelectedNodeId(clickedNode.id)}
            fitView
            fitViewOptions={{ padding: 0.22 }}
          >
            <Background color="rgba(129,140,248,0.22)" gap={24} />
            <MiniMap pannable zoomable className="flow-minimap" />
            <Controls className="flow-controls" />
          </ReactFlow>
        </div>

        <div className="flow-studio-bottom">
          <FlowValidationPanel issues={validation.issues} valid={validation.valid} />
          <div className="flow-actions">
            {statusText ? <p className="flow-status-message">{statusText}</p> : null}
            <button className="btn btn-secondary" onClick={simulateCurrentFlow} type="button">
              Simular sem publicar
            </button>
            <button className="btn btn-secondary" disabled={saving} type="submit" value="Rascunho">
              Salvar rascunho
            </button>
            <button className="btn btn-primary" disabled={saving} type="submit" value="Ativa">
              {saving ? "Publicando..." : "Publicar fluxo"}
            </button>
          </div>
        </div>
      </form>

      <aside className="flow-studio-side">
        <NodeInspector nodeItem={selectedNode} onUpdate={updateNodeData} />

        <section className="flow-inspector-panel">
          <span className="workspace-kicker">Preview</span>
          <div className="flow-chat">
            <div className="flow-chat-bubble flow-chat-bubble-user">
              <span>Cliente</span>
              <p>{fallback.triggerType === "new_message" ? "Olá, preciso de ajuda" : fallback.keyword || "quero"}</p>
            </div>
            {previewSteps
              .filter((item) => item.type === "message" || item.type === "wait" || item.type === "action")
              .map((item) => {
                if (item.type === "wait") {
                  return (
                    <div className="flow-chat-wait" key={item.id}>
                      espera de {item.data.delayMinutes || 0} min
                    </div>
                  );
                }

                return (
                  <div className="flow-chat-bubble flow-chat-bubble-bot" key={item.id}>
                    <span>{item.type === "action" ? "Ação" : "Klio"}</span>
                    <p>{item.type === "action" ? actionLabel(item.data.actionType) : item.data.message || "Mensagem sem texto"}</p>
                    {item.type === "message" && item.data.mediaType ? <small>Mídia: {item.data.mediaType}</small> : null}
                    {item.type === "message" && item.data.quickReplies ? (
                      <div className="flow-quick-replies">
                        {item.data.quickReplies.split(/[|,]/).map((reply) => (
                          <button key={reply.trim()} type="button">
                            {reply.trim()}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </section>

        <section className="flow-inspector-panel">
          <div className="command-panel-head">
            <strong>Teste rápido</strong>
            <span className="mini">{automations.length} fluxos salvos</span>
          </div>
          <label className="flow-field">
            <span>Fluxo para testar</span>
            <select className="select" onChange={(event) => setTestingId(event.target.value)} value={testingId}>
              <option value="">Selecione um fluxo</option>
              {automations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flow-two-columns">
            <label className="flow-field">
              <span>Contato</span>
              <input className="input" value={testContactName} onChange={(event) => setTestContactName(event.target.value)} />
            </label>
            <label className="flow-field">
              <span>Destino</span>
              <input className="input" placeholder="5511999999999" value={testRecipient} onChange={(event) => setTestRecipient(event.target.value)} />
            </label>
          </div>
          {selectedAutomation ? (
            <div className="flow-selected-mini">
              <strong>{selectedAutomation.name}</strong>
              <span>{savedFlowLabel}</span>
            </div>
          ) : null}
          <button className="btn btn-secondary flow-test-button" disabled={testing} onClick={handleTest} type="button">
            {testing ? "Testando..." : "Enviar teste"}
          </button>
        </section>

        <section className="flow-inspector-panel">
          <div className="command-panel-head">
            <strong>Fluxos criados</strong>
            <span className="mini">{automations.length} no total</span>
          </div>
          <div className="flow-library-list">
            {automations.length ? (
              automations.map((item) => {
                const details = decodeTrigger(item.trigger);
                const visual = decodeVisualTrigger(item.trigger);

                return (
                  <button
                    className={`flow-library-item${testingId === item.id ? " flow-library-item-active" : ""}`}
                    key={item.id}
                    onClick={() => {
                      setTestingId(item.id);
                      if (visual) {
                        const restored = fromVisualTrigger(visual);
                        setNodes(restored.nodes);
                        setEdges(restored.edges);
                        setName(item.name);
                        setStatus(item.status);
                        setSelectedNodeId(restored.nodes[0]?.id || null);
                      }
                    }}
                    type="button"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{visual ? `${visual.nodes.length} blocos visuais` : triggerLabel(details.triggerType, details.keyword)}</span>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </button>
                );
              })
            ) : (
              <div className="builder-empty-state">
                <strong>Nenhum fluxo salvo ainda</strong>
                <p className="mini">Monte o primeiro mapa visual e publique quando estiver pronto.</p>
              </div>
            )}
          </div>
        </section>
      </aside>
    </section>
  );
}
