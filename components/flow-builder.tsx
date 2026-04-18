"use client";

import Link from "next/link";
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
  type AutomationDetails,
  type FlowCanvasEdge,
  type FlowCanvasNode,
  type FlowCanvasNodeType,
  type VisualAutomationTrigger,
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
  nodeKindLabel?: string;
  category?: "trigger" | "action" | "logic" | "data";
  channel?: string;
  triggerType?: AutomationDetails["triggerType"];
  keyword?: string;
  message?: string;
  quickReplies?: string;
  delayMinutes?: number;
  condition?: string;
  actionType?: AutomationDetails["actionType"];
  variableName?: string;
  variableValue?: string;
};

type StudioNode = Node<FlowNodeData, FlowCanvasNodeType>;
type StudioEdge = Edge<{ label?: string }>;
type FlowSnapshot = { nodes: StudioNode[]; edges: StudioEdge[] };
type PaletteItem = {
  id: string;
  icon: string;
  label: string;
  description: string;
  baseType: FlowCanvasNodeType;
  data: FlowNodeData;
};

const draftKey = "klio-flow-studio-draft-v5";

const channels = [
  { id: "instagram", label: "Instagram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "messenger", label: "Messenger" },
  { id: "telegram", label: "Telegram" },
  { id: "multi", label: "Multicanal" }
];

const triggers = [
  { id: "new_message", label: "Nova mensagem" },
  { id: "keyword", label: "Palavra-chave" }
];

const actions = [
  { id: "reply_same_channel", label: "Responder no canal" },
  { id: "handoff_whatsapp", label: "Levar para WhatsApp" },
  { id: "notify_team", label: "Avisar equipe" }
];

const variableTokens = ["{{nome}}", "{{telefone}}", "{{origem_lead}}", "{{ultima_compra}}", "{{atendente}}"];

const nodeMeta: Record<FlowCanvasNodeType, { icon: string; label: string; tone: string }> = {
  entry: { icon: "IN", label: "Entrada", tone: "entry" },
  message: { icon: "MSG", label: "Mensagem", tone: "message" },
  wait: { icon: "WAIT", label: "Espera", tone: "wait" },
  condition: { icon: "IF", label: "Condição", tone: "condition" },
  action: { icon: "GO", label: "Ação", tone: "action" }
};

function createNode(id: string, type: FlowCanvasNodeType, x: number, y: number, data: FlowNodeData): StudioNode {
  return {
    id,
    type,
    position: { x, y },
    data,
    className: `flow-studio-node-shell flow-studio-node-${type}`
  };
}

function createEdge(source: string, target: string, label?: string): StudioEdge {
  return {
    id: `${source}-${target}-${label || "main"}`,
    source,
    target,
    label,
    type: "smoothstep",
    animated: true,
    className: "flow-studio-edge"
  };
}

function cloneFlow(flow: FlowSnapshot): FlowSnapshot {
  return {
    nodes: flow.nodes.map((node) => ({ ...node, data: { ...node.data }, position: { ...node.position } })),
    edges: flow.edges.map((edge) => ({ ...edge }))
  };
}

function readDraft() {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(draftKey) || "null");
    return parsed?.nodes && parsed?.edges ? parsed : null;
  } catch {
    return null;
  }
}

function getLinearPath(nodes: StudioNode[], edges: StudioEdge[]) {
  const entry = nodes.find((node) => node.type === "entry");
  if (!entry) return [];

  const path = [entry.id];
  const seen = new Set(path);
  let current = entry.id;

  while (true) {
    const next = edges.find((edge) => edge.source === current && !seen.has(edge.target));
    if (!next) break;
    path.push(next.target);
    seen.add(next.target);
    current = next.target;
  }

  return path;
}

function getFallback(nodes: StudioNode[], edges: StudioEdge[]): AutomationDetails {
  const ordered = getLinearPath(nodes, edges)
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is StudioNode => Boolean(node));
  const entry = ordered.find((node) => node.type === "entry") || nodes.find((node) => node.type === "entry");
  const action = [...ordered].reverse().find((node) => node.type === "action") || nodes.find((node) => node.type === "action");
  const wait = ordered.find((node) => node.type === "wait") || nodes.find((node) => node.type === "wait");

  return {
    triggerType: entry?.data.triggerType === "new_message" ? "new_message" : "keyword",
    keyword: entry?.data.keyword || "",
    actionType: action?.data.actionType || "reply_same_channel",
    secondMessage: action?.data.message || "",
    delayMinutes: Number(wait?.data.delayMinutes || 0)
  };
}

function validateFlow(nodes: StudioNode[], edges: StudioEdge[]) {
  const issues: string[] = [];
  const entry = nodes.find((node) => node.type === "entry");
  const message = nodes.find((node) => node.type === "message" && String(node.data.message || "").trim());
  const path = getLinearPath(nodes, edges);

  if (!entry) issues.push("Adicione um bloco de entrada para iniciar o fluxo.");
  if (!message) issues.push("Inclua pelo menos uma mensagem clara para o cliente.");
  if (entry && path.length < 2) issues.push("Conecte a entrada ao próximo bloco.");
  if (entry && message && !path.includes(message.id)) issues.push("A mensagem principal precisa estar no caminho conectado.");

  return { valid: issues.length === 0, issues };
}

function toCanvas(nodes: StudioNode[], edges: StudioEdge[]): VisualAutomationTrigger {
  const linearPath = getLinearPath(nodes, edges);
  const entry = nodes.find((node) => node.type === "entry");

  return {
    version: 2,
    nodes: nodes.map(
      (node): FlowCanvasNode => ({
        id: node.id,
        type: node.type || "message",
        position: node.position,
        data: { ...node.data }
      })
    ),
    edges: edges.map(
      (edge): FlowCanvasEdge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: typeof edge.label === "string" ? edge.label : undefined
      })
    ),
    entryNodeId: entry?.id || linearPath[0] || "",
    linearPath,
    legacyFallback: getFallback(nodes, edges)
  };
}

function fromCanvas(trigger: VisualAutomationTrigger): FlowSnapshot {
  return {
    nodes: trigger.nodes.map((node) => createNode(node.id, node.type, node.position.x, node.position.y, node.data)),
    edges: trigger.edges.map((edge) => createEdge(edge.source, edge.target, edge.label))
  };
}

function getNodeSummary(node: Pick<StudioNode, "type" | "data">) {
  if (node.type === "entry") {
    const channel = channels.find((item) => item.id === node.data.channel)?.label || "Canal";
    const trigger = node.data.triggerType === "new_message" ? "nova mensagem" : node.data.keyword || "palavra-chave";
    return `${channel} · ${trigger}`;
  }
  if (node.type === "message") return node.data.message || "Mensagem sem texto";
  if (node.type === "wait") return `${node.data.delayMinutes || 0} min de espera`;
  if (node.type === "condition") return node.data.condition || "Condição sem regra";
  if (node.data.category === "data") return `${node.data.variableName || "variável"} = ${node.data.variableValue || "valor"}`;
  return actions.find((item) => item.id === node.data.actionType)?.label || "Ação";
}

const paletteGroups: { title: string; items: PaletteItem[] }[] = [
  {
    title: "Entradas",
    items: [
      {
        id: "incoming-message",
        icon: "IN",
        label: "Mensagem recebida",
        description: "Começa quando alguém inicia uma conversa.",
        baseType: "entry",
        data: { label: "Mensagem recebida", nodeKindLabel: "Mensagem recebida", category: "trigger", channel: "whatsapp", triggerType: "new_message" }
      },
      {
        id: "new-lead",
        icon: "LEAD",
        label: "Novo lead",
        description: "Usa comentário ou campanha para abrir um fluxo.",
        baseType: "entry",
        data: { label: "Novo lead", nodeKindLabel: "Novo lead", category: "trigger", channel: "instagram", triggerType: "keyword", keyword: "quero" }
      }
    ]
  },
  {
    title: "Ações",
    items: [
      {
        id: "send-message",
        icon: "MSG",
        label: "Enviar mensagem",
        description: "Resposta automática com variáveis.",
        baseType: "message",
        data: { label: "Enviar mensagem", nodeKindLabel: "Enviar mensagem", category: "action", message: "Olá {{nome}}, recebi sua mensagem e vou te atender agora." }
      },
      {
        id: "wait",
        icon: "WAIT",
        label: "Esperar",
        description: "Cria uma pausa antes da próxima etapa.",
        baseType: "wait",
        data: { label: "Esperar", nodeKindLabel: "Esperar", category: "action", delayMinutes: 5 }
      },
      {
        id: "notify-team",
        icon: "TEAM",
        label: "Avisar equipe",
        description: "Faz o repasse para um humano.",
        baseType: "action",
        data: { label: "Avisar equipe", nodeKindLabel: "Avisar equipe", category: "action", actionType: "notify_team", message: "Lead pronto para atendimento humano." }
      }
    ]
  },
  {
    title: "Lógica e dados",
    items: [
      {
        id: "condition",
        icon: "IF",
        label: "Condição",
        description: "Filtra por palavra, contexto ou intenção.",
        baseType: "condition",
        data: { label: "Condição", nodeKindLabel: "Condição", category: "logic", condition: "contém preço" }
      },
      {
        id: "variable",
        icon: "VAR",
        label: "Setar variável",
        description: "Guarda contexto para usar depois.",
        baseType: "action",
        data: { label: "Setar variável", nodeKindLabel: "Setar variável", category: "data", variableName: "origem_lead", variableValue: "instagram", actionType: "reply_same_channel" }
      }
    ]
  }
];

const templates = [
  {
    id: "lead-instagram",
    title: "Lead do Instagram",
    subtitle: "Capta o interesse, qualifica e leva para o canal certo.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Comentário no Instagram", channel: "instagram", triggerType: "keyword", keyword: "quero" }),
      createNode("message-1", "message", 320, 80, { label: "Resposta inicial", message: "Oi {{nome}}, vi seu interesse. Me diga em uma frase o que você quer automatizar primeiro." }),
      createNode("wait-1", "wait", 640, 80, { label: "Esperar retorno", delayMinutes: 10 }),
      createNode("action-1", "action", 960, 80, { label: "Levar para WhatsApp", actionType: "handoff_whatsapp", message: "Perfeito. Vou continuar com você no WhatsApp." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "wait-1"), createEdge("wait-1", "action-1")]
  },
  {
    id: "support-whatsapp",
    title: "Atendimento inicial",
    subtitle: "Recebe, responde e escala o atendimento quando precisar.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Nova mensagem", channel: "whatsapp", triggerType: "new_message" }),
      createNode("message-1", "message", 320, 80, { label: "Boas-vindas", message: "Olá {{nome}}, recebi sua mensagem e já vou te ajudar." }),
      createNode("condition-1", "condition", 640, 80, { label: "Separar intenção", condition: "contém orçamento ou suporte" }),
      createNode("action-1", "action", 960, 80, { label: "Avisar equipe", actionType: "notify_team", message: "Cliente pediu atendimento humano." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "condition-1"), createEdge("condition-1", "action-1", "Sim")]
  },
  {
    id: "reactivate",
    title: "Reengajar oportunidade",
    subtitle: "Volta a falar com quem parou no meio da conversa.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Lead parado", channel: "multi", triggerType: "keyword", keyword: "sem resposta" }),
      createNode("message-1", "message", 320, 80, { label: "Mensagem de retorno", message: "Oi {{nome}}, passei para ver se ainda faz sentido continuar por aqui." }),
      createNode("wait-1", "wait", 640, 80, { label: "Esperar resposta", delayMinutes: 60 }),
      createNode("message-2", "message", 960, 80, { label: "Último toque", message: "Se preferir, posso te encaminhar direto para um atendente agora." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "wait-1"), createEdge("wait-1", "message-2")]
  }
];

function FlowNodeCard({ data, type, selected }: NodeProps<StudioNode>) {
  const nodeType = type || "message";
  const meta = nodeMeta[nodeType];

  return (
    <div className={`flow-node-card flow-node-card-${meta.tone}${selected ? " flow-node-card-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-node-handle" />
      <div className="flow-node-card-head">
        <span>{meta.icon}</span>
        <div>
          <strong>{data.label}</strong>
          <small>{data.nodeKindLabel || meta.label}</small>
        </div>
      </div>
      {data.category ? <span className={`flow-node-kind flow-node-kind-${data.category}`}>{data.category}</span> : null}
      <p>{getNodeSummary({ type: nodeType, data })}</p>
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

function InspectorPanel({ nodeItem, onUpdate }: { nodeItem: StudioNode | null; onUpdate: (id: string, data: Partial<FlowNodeData>) => void }) {
  if (!nodeItem) {
    return (
      <section className="flow-inspector-panel">
        <div className="flow-panel-title">
          <strong>Editor de Bloco</strong>
        </div>
        <div className="builder-empty-state">
          <strong>Escolha um bloco para editar</strong>
          <p className="mini">Clique no canvas para ajustar gatilho, mensagem, espera ou ação final.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-inspector-panel">
      <div className="flow-panel-title">
        <strong>Editor de Bloco</strong>
      </div>

      <div className="flow-panel-body">
        <label className="flow-field">
          <span>Nome do bloco</span>
          <input className="input" value={nodeItem.data.label || ""} onChange={(event) => onUpdate(nodeItem.id, { label: event.target.value })} />
        </label>

        {nodeItem.type === "entry" ? (
          <>
            <div className="flow-two-columns">
              <label className="flow-field">
                <span>Canal</span>
                <select className="select" value={nodeItem.data.channel || "whatsapp"} onChange={(event) => onUpdate(nodeItem.id, { channel: event.target.value })}>
                  {channels.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flow-field">
                <span>Gatilho</span>
                <select className="select" value={nodeItem.data.triggerType || "new_message"} onChange={(event) => onUpdate(nodeItem.id, { triggerType: event.target.value as AutomationDetails["triggerType"] })}>
                  {triggers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flow-field">
              <span>Palavra-chave</span>
              <input className="input" value={nodeItem.data.keyword || ""} onChange={(event) => onUpdate(nodeItem.id, { keyword: event.target.value })} />
            </label>
          </>
        ) : null}

        {nodeItem.type === "message" ? (
          <>
            <label className="flow-field">
              <span>Mensagem</span>
              <textarea className="textarea flow-message-box" value={nodeItem.data.message || ""} onChange={(event) => onUpdate(nodeItem.id, { message: event.target.value })} />
            </label>
            <label className="flow-field">
              <span>Respostas rápidas</span>
              <input className="input" value={nodeItem.data.quickReplies || ""} onChange={(event) => onUpdate(nodeItem.id, { quickReplies: event.target.value })} />
            </label>
            <div className="flow-variable-row">
              {variableTokens.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() =>
                    onUpdate(nodeItem.id, {
                      message: `${nodeItem.data.message || ""}${nodeItem.data.message ? " " : ""}${token}`
                    })
                  }
                >
                  {token}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {nodeItem.type === "wait" ? (
          <label className="flow-field">
            <span>Tempo de espera</span>
            <input className="input" min={0} type="number" value={nodeItem.data.delayMinutes || 0} onChange={(event) => onUpdate(nodeItem.id, { delayMinutes: Number(event.target.value) })} />
          </label>
        ) : null}

        {nodeItem.type === "condition" ? (
          <label className="flow-field">
            <span>Condição</span>
            <input className="input" value={nodeItem.data.condition || ""} onChange={(event) => onUpdate(nodeItem.id, { condition: event.target.value })} />
          </label>
        ) : null}

        {nodeItem.type === "action" ? (
          <>
            <label className="flow-field">
              <span>Tipo de ação</span>
              <select className="select" value={nodeItem.data.actionType || "reply_same_channel"} onChange={(event) => onUpdate(nodeItem.id, { actionType: event.target.value as AutomationDetails["actionType"] })}>
                {actions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flow-field">
              <span>Mensagem complementar</span>
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
      </div>
    </section>
  );
}

export function FlowBuilder({ initialAutomations }: FlowBuilderProps) {
  const boot = useMemo(() => readDraft(), []);
  const initialFlow = useMemo(() => cloneFlow({ nodes: templates[0].nodes, edges: templates[0].edges }), []);

  const [automations, setAutomations] = useState(initialAutomations);
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(boot?.nodes || initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StudioEdge>(boot?.edges || initialFlow.edges);
  const [name, setName] = useState(boot?.name || "Qualificação automática");
  const [status, setStatus] = useState(boot?.status || "Ativa");
  const [selectedId, setSelectedId] = useState<string | null>((boot?.nodes || initialFlow.nodes)[0]?.id || null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusText, setStatusText] = useState("Organize sua automação com mais clareza.");
  const [draftVersion, setDraftVersion] = useState(boot?.version || 1);
  const [autosaveLabel, setAutosaveLabel] = useState(boot?.updatedAt ? `Salvo às ${boot.updatedAt}` : "Autosave ativo");
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");
  const [history, setHistory] = useState<FlowSnapshot[]>([]);
  const [future, setFuture] = useState<FlowSnapshot[]>([]);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedId) || null, [nodes, selectedId]);
  const validation = useMemo(() => validateFlow(nodes, edges), [nodes, edges]);
  const previewSteps = useMemo(
    () => getLinearPath(nodes, edges).map((id) => nodes.find((node) => node.id === id)).filter((node): node is StudioNode => Boolean(node)),
    [nodes, edges]
  );
  const fallback = useMemo(() => getFallback(nodes, edges), [nodes, edges]);
  const activeCount = useMemo(() => automations.filter((item) => item.status === "Ativa").length, [automations]);
  const draftCount = useMemo(() => automations.filter((item) => item.status !== "Ativa").length, [automations]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const updatedAt = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setDraftVersion((current: number) => {
        const nextVersion = current + 1;
        window.localStorage.setItem(draftKey, JSON.stringify({ name, status, nodes, edges, updatedAt, version: nextVersion }));
        return nextVersion;
      });
      setAutosaveLabel(`Salvo às ${updatedAt}`);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [name, status, nodes, edges]);

  function remember() {
    setHistory((current) => [...current.slice(-19), cloneFlow({ nodes, edges })]);
    setFuture([]);
  }

  function applyTemplate(templateId: string) {
    const template = templates.find((item) => item.id === templateId) || templates[0];
    const nextFlow = cloneFlow({ nodes: template.nodes, edges: template.edges });
    remember();
    setNodes(nextFlow.nodes);
    setEdges(nextFlow.edges);
    setName(template.title);
    setSelectedId(nextFlow.nodes[0]?.id || null);
    setStatusText(`Template aplicado: ${template.title}. Agora deixe o texto com a cara da sua operação.`);
  }

  function addBlock(item: PaletteItem) {
    remember();
    const nextNode = createNode(`${item.baseType}-${Date.now()}`, item.baseType, 180 + nodes.length * 40, 140 + nodes.length * 28, { ...item.data });
    setNodes((current) => [...current, nextNode]);
    setSelectedId(nextNode.id);
    setStatusText(`Bloco adicionado: ${item.label}.`);
  }

  function duplicateSelectedNode() {
    const selected = nodes.find((node) => node.id === selectedId);
    if (!selected) return;
    remember();
    const copy = {
      ...selected,
      id: `${selected.type}-copy-${Date.now()}`,
      position: { x: selected.position.x + 48, y: selected.position.y + 48 },
      data: { ...selected.data, label: `${selected.data.label} cópia` }
    };
    setNodes((current) => [...current, copy]);
    setSelectedId(copy.id);
    setStatusText("Bloco duplicado com sucesso.");
  }

  function removeSelectedNode() {
    if (!selectedId) return;
    remember();
    setNodes((current) => current.filter((node) => node.id !== selectedId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedId && edge.target !== selectedId));
    setSelectedId(null);
    setStatusText("Bloco removido do canvas.");
  }

  function updateNodeData(id: string, data: Partial<FlowNodeData>) {
    remember();
    setNodes((current) => current.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node)));
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((current) => [cloneFlow({ nodes, edges }), ...current.slice(0, 19)]);
    setHistory((current) => current.slice(0, -1));
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current.slice(-19), cloneFlow({ nodes, edges })]);
    setFuture((current) => current.slice(1));
    setNodes(next.nodes);
    setEdges(next.edges);
  }

  async function saveFlow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedStatus = submitter?.value || status;
    const finalStatus = validation.valid ? requestedStatus : "Rascunho";
    const canvas = toCanvas(nodes, edges);
    const primaryMessage = previewSteps.find((node) => node.type === "message")?.data.message || "Mensagem automática da Klio.";

    setSaving(true);
    const response = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        channel: nodes.find((node) => node.type === "entry")?.data.channel || "multi",
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
    setSaving(false);

    if (!response.ok) {
      setStatusText(data.error || "Não foi possível salvar o fluxo.");
      return;
    }

    setAutomations((current) => [data.automation, ...current]);
    setTestingId(data.automation.id);
    setStatus(finalStatus);
    setStatusText(
      validation.valid
        ? finalStatus === "Ativa"
          ? "Fluxo publicado com sucesso."
          : "Fluxo salvo como rascunho."
        : "Fluxo salvo como rascunho. Ajuste os pontos pendentes antes de publicar."
    );
  }

  async function testFlow() {
    if (!testingId) {
      setStatusText("Selecione ou salve um fluxo antes de testar.");
      return;
    }
    if (!testRecipient.trim()) {
      setStatusText("Informe um destino de teste.");
      return;
    }

    setTesting(true);
    const response = await fetch("/api/automations/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        automationId: testingId,
        recipient: testRecipient,
        contactName: testContactName,
        channel: nodes.find((node) => node.type === "entry")?.data.channel || "whatsapp"
      })
    });

    const data = await response.json();
    setTesting(false);
    setStatusText(response.ok ? data.preview || "Teste concluído." : data.error || "Falha ao testar fluxo.");
  }

  return (
    <section className="flow-studio-v2">
      <section className="flow-studio-summary">
        <div className="flow-summary-copy">
          <h2>Flow Studio</h2>
          <p>Monte automações com menos ruído visual, blocos organizados e edição prática em uma única tela.</p>
        </div>
        <div className="flow-overview-grid">
          <article className="flow-overview-card">
            <strong>{automations.length}</strong>
            <span>Fluxos salvos</span>
            <small>Biblioteca pronta para reaproveitar.</small>
          </article>
          <article className="flow-overview-card">
            <strong>{activeCount}</strong>
            <span>Ativos</span>
            <small>Fluxos que podem rodar agora.</small>
          </article>
          <article className="flow-overview-card">
            <strong>{draftCount}</strong>
            <span>Rascunhos</span>
            <small>Aguardando revisão final.</small>
          </article>
          <article className="flow-overview-card">
            <strong>{templates.length}</strong>
            <span>Templates</span>
            <small>Atalhos para começar rápido.</small>
          </article>
        </div>
      </section>

      <section className="flow-template-section">
        <div className="flow-section-head">
          <div>
            <span className="workspace-kicker">Templates</span>
            <h3>Início rápido</h3>
          </div>
        </div>
        <div className="flow-template-grid">
          {templates.map((template) => (
            <button className="flow-template-card" key={template.id} type="button" onClick={() => applyTemplate(template.id)}>
              <span className="flow-template-badge">Template</span>
              <strong>{template.title}</strong>
              <p>{template.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="flow-workbench">
        <aside className="flow-workbench-rail">
          <section className="flow-rail-card">
            <div className="flow-rail-head">
              <div>
                <span className="workspace-kicker">Biblioteca de Blocos</span>
                <strong>Blocos para montar o fluxo</strong>
              </div>
            </div>

            <div className="flow-builder-toolbar">
              <div className="flow-toolbar-actions">
                <button className="btn btn-secondary" disabled={!selectedNode} onClick={duplicateSelectedNode} type="button">
                  Duplicar bloco
                </button>
                <button className="btn btn-secondary" disabled={!selectedNode} onClick={removeSelectedNode} type="button">
                  Excluir bloco
                </button>
                <button className="btn btn-secondary" disabled={!history.length} onClick={undo} type="button">
                  Desfazer
                </button>
                <button className="btn btn-secondary" disabled={!future.length} onClick={redo} type="button">
                  Refazer
                </button>
              </div>

              {paletteGroups.map((group) => (
                <div className="flow-toolbar-group" key={group.title}>
                  <span>{group.title}</span>
                  <div className="flow-toolbar-grid">
                    {group.items.map((item) => (
                      <button className="flow-toolbar-node" key={item.id} type="button" onClick={() => addBlock(item)}>
                        <strong>{item.icon}</strong>
                        <div>
                          <span>{item.label}</span>
                          <small>{item.description}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flow-rail-card">
            <div className="flow-rail-head">
              <div>
                <span className="workspace-kicker">Biblioteca</span>
                <strong>Fluxos já montados</strong>
              </div>
              <span className="mini">{automations.length}</span>
            </div>

            <div className="flow-library-list">
              {automations.length ? (
                automations.map((item) => {
                  const visual = decodeVisualTrigger(item.trigger);
                  return (
                    <button
                      className={`flow-library-item${testingId === item.id ? " flow-library-item-active" : ""}`}
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTestingId(item.id);
                        if (visual) {
                          const restored = fromCanvas(visual);
                          setNodes(restored.nodes);
                          setEdges(restored.edges);
                          setName(item.name);
                          setStatus(item.status);
                          setSelectedId(restored.nodes[0]?.id || null);
                          setStatusText(`Fluxo "${item.name}" carregado no canvas.`);
                        }
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <span>{visual ? `${visual.nodes.length} blocos visuais` : item.channel}</span>
                      </div>
                      <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                    </button>
                  );
                })
              ) : (
                <div className="builder-empty-state">
                  <strong>Nenhum fluxo salvo</strong>
                  <p className="mini">Monte uma automação visual e salve para reaproveitar depois.</p>
                </div>
              )}
            </div>
          </section>
        </aside>

        <form className="flow-workbench-main flow-workbench-main-v2" onSubmit={saveFlow}>
          <div className="flow-command-bar">
            <div className="flow-command-bar-left">
              <Link className="flow-back-button" href="/dashboard">
                Voltar
              </Link>
              <input aria-label="Nome do fluxo" className="flow-title-input" value={name} onChange={(event) => setName(event.target.value)} />
            </div>

            <div className="flow-command-actions">
              <span className="flow-autosave-chip">v{draftVersion} · {autosaveLabel}</span>
              <button className="btn btn-secondary" disabled={saving} type="submit" value="Rascunho">
                {saving && status !== "Ativa" ? "Salvando..." : "Salvar rascunho"}
              </button>
              <button className="btn btn-primary" disabled={saving} type="submit" value="Ativa">
                {saving && status === "Ativa" ? "Publicando..." : "Publicar fluxo"}
              </button>
            </div>
          </div>

          <div className="flow-canvas-frame">
            <div className="flow-canvas-shell flow-canvas-shell-roomy">
              <ReactFlow<StudioNode, StudioEdge>
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(connection: Connection) => {
                  remember();
                  setEdges((current) => addEdge({ ...connection, type: "smoothstep", animated: true, className: "flow-studio-edge" }, current));
                }}
                onNodeClick={(_, node) => setSelectedId(node.id)}
                fitView
                fitViewOptions={{ padding: 0.2 }}
              >
                <Background color="rgba(71, 85, 105, 0.4)" gap={24} size={1} />
                <MiniMap pannable zoomable className="flow-minimap" />
                <Controls className="flow-controls" position="bottom-left" />
              </ReactFlow>
            </div>
          </div>

          <div className="flow-studio-bottom">
            <div className={`flow-validation-panel${validation.valid ? " flow-validation-panel-valid" : ""}`}>
              <strong>{validation.valid ? "Fluxo pronto para publicar" : "Ajustes antes de publicar"}</strong>
              {validation.issues.length ? (
                <ul>
                  {validation.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="mini">Entrada, mensagem e caminho principal estão conectados.</p>
              )}
            </div>

            <div className="flow-status-line">
              <span className={status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{status}</span>
              <p>{statusText}</p>
            </div>
          </div>
        </form>

        <aside className="flow-studio-side">
          <InspectorPanel nodeItem={selectedNode} onUpdate={updateNodeData} />

          <section className="flow-inspector-panel">
            <div className="flow-panel-title">
              <strong>Preview da Conversa</strong>
            </div>
            <div className="flow-panel-body">
              <div className="flow-chat">
                <div className="flow-chat-bubble flow-chat-bubble-user">
                  <span>Cliente</span>
                  <p>{fallback.triggerType === "new_message" ? "Olá, preciso de ajuda" : fallback.keyword || "quero"}</p>
                </div>

                {previewSteps
                  .filter((node) => node.type !== "entry" && node.type !== "condition")
                  .map((node) =>
                    node.type === "wait" ? (
                      <div className="flow-chat-wait" key={node.id}>
                        espera de {node.data.delayMinutes || 0} min
                      </div>
                    ) : (
                      <div className="flow-chat-bubble flow-chat-bubble-bot" key={node.id}>
                        <span>{node.type === "action" ? "Klio · ação" : "Klio"}</span>
                        <p>{getNodeSummary(node)}</p>
                        {node.type === "message" && node.data.quickReplies ? (
                          <div className="flow-quick-replies">
                            {node.data.quickReplies.split(/[|,]/).map((reply) => (
                              <button key={reply.trim()} type="button">
                                {reply.trim()}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  )}
              </div>
            </div>
          </section>

          <section className="flow-inspector-panel">
            <div className="flow-panel-title flow-panel-title-between">
              <strong>Teste rápido</strong>
              <span>Executa sem republicar</span>
            </div>
            <div className="flow-panel-body">
              <label className="flow-field">
                <span>Fluxo para testar</span>
                <select className="select" value={testingId} onChange={(event) => setTestingId(event.target.value)}>
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

              <button className="btn btn-primary flow-test-button" disabled={testing} onClick={testFlow} type="button">
                {testing ? "Executando..." : "Executar teste"}
              </button>
            </div>
          </section>
        </aside>
      </section>
    </section>
  );
}
