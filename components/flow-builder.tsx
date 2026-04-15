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
import { FormEvent, useMemo, useState } from "react";
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
  channel?: string;
  triggerType?: AutomationDetails["triggerType"];
  keyword?: string;
  message?: string;
  delayMinutes?: number;
  condition?: string;
  actionType?: AutomationDetails["actionType"];
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
        channel: item.data.channel,
        triggerType: item.data.triggerType,
        keyword: item.data.keyword,
        message: item.data.message,
        delayMinutes: item.data.delayMinutes,
        condition: item.data.condition,
        actionType: item.data.actionType
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

function FlowNodeCard(props: NodeProps<StudioNode>) {
  const meta = nodeTypeMeta[props.type || "message"];

  return (
    <div className={`flow-node-card flow-node-card-${meta.tone}${props.selected ? " flow-node-card-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-node-handle" />
      <div className="flow-node-card-head">
        <span>{meta.icon}</span>
        <div>
          <strong>{props.data.label}</strong>
          <small>{meta.label}</small>
        </div>
      </div>
      <p>{nodeSummary({ type: props.type || "message", data: props.data })}</p>
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

function FlowToolbar({ onAdd }: { onAdd: (type: FlowCanvasNodeType) => void }) {
  const items: FlowCanvasNodeType[] = ["entry", "message", "wait", "condition", "action"];

  return (
    <div className="flow-canvas-toolbar">
      {items.map((item) => (
        <button key={item} type="button" onClick={() => onAdd(item)}>
          <span>{nodeTypeMeta[item].icon}</span>
          {nodeTypeMeta[item].label}
        </button>
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
        <label className="flow-field">
          <span>Mensagem enviada pela Klio</span>
          <textarea className="textarea flow-message-box" value={nodeItem.data.message || ""} onChange={(event) => onUpdate(nodeItem.id, { message: event.target.value })} />
        </label>
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
        </>
      ) : null}
    </section>
  );
}

export function FlowBuilder({ initialAutomations }: FlowBuilderProps) {
  const initialTemplate = cloneTemplate(templates[0]);
  const [automations, setAutomations] = useState(initialAutomations);
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(initialTemplate.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StudioEdge>(initialTemplate.edges);
  const [name, setName] = useState("Qualificação automática de lead");
  const [status, setStatus] = useState("Ativa");
  const [activeTemplate, setActiveTemplate] = useState("lead");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [statusText, setStatusText] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");

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

  function applyTemplate(template: Template) {
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

  function updateNodeData(id: string, data: Partial<FlowNodeData>) {
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
          <FlowToolbar onAdd={handleAddNode} />
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
