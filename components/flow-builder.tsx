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
  type AutomationDetails,
  type FlowCanvasEdge,
  type FlowCanvasNode,
  type FlowCanvasNodeType,
  type VisualAutomationTrigger,
  decodeVisualTrigger
} from "@/lib/automation-utils";

type AutomationItem = { id: string; name: string; channel: string; trigger: string; status: string; message: string };
type FlowBuilderProps = { initialAutomations: AutomationItem[] };
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
type PaletteItem = { id: string; icon: string; label: string; description: string; baseType: FlowCanvasNodeType; data: FlowNodeData };

const draftKey = "klio-flow-studio-draft-v4";
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
  condition: { icon: "IF", label: "Condicao", tone: "condition" },
  action: { icon: "GO", label: "Acao", tone: "action" }
};

function createNode(id: string, type: FlowCanvasNodeType, x: number, y: number, data: FlowNodeData): StudioNode {
  return { id, type, position: { x, y }, data, className: `flow-studio-node-shell flow-studio-node-${type}` };
}

function createEdge(source: string, target: string, label?: string): StudioEdge {
  return { id: `${source}-${target}`, source, target, label, type: "smoothstep", animated: true, className: "flow-studio-edge" };
}

function cloneFlow(flow: FlowSnapshot): FlowSnapshot {
  return {
    nodes: flow.nodes.map((item) => ({ ...item, data: { ...item.data }, position: { ...item.position } })),
    edges: flow.edges.map((item) => ({ ...item }))
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
  const entry = nodes.find((item) => item.type === "entry");
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
  const ordered = getLinearPath(nodes, edges).map((id) => nodes.find((item) => item.id === id)).filter((item): item is StudioNode => Boolean(item));
  const entry = ordered.find((item) => item.type === "entry") || nodes.find((item) => item.type === "entry");
  const action = [...ordered].reverse().find((item) => item.type === "action") || nodes.find((item) => item.type === "action");
  const wait = ordered.find((item) => item.type === "wait") || nodes.find((item) => item.type === "wait");
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
  const entry = nodes.find((item) => item.type === "entry");
  const message = nodes.find((item) => item.type === "message" && String(item.data.message || "").trim());
  const path = getLinearPath(nodes, edges);
  if (!entry) issues.push("Adicione uma entrada para iniciar o fluxo.");
  if (!message) issues.push("Inclua pelo menos uma mensagem clara para o cliente.");
  if (entry && path.length < 2) issues.push("Conecte a entrada ao proximo bloco.");
  if (entry && message && !path.includes(message.id)) issues.push("A mensagem principal precisa fazer parte do caminho conectado.");
  return { valid: issues.length === 0, issues };
}

function toCanvas(nodes: StudioNode[], edges: StudioEdge[]): VisualAutomationTrigger {
  const linearPath = getLinearPath(nodes, edges);
  const entry = nodes.find((item) => item.type === "entry");
  return {
    version: 2,
    nodes: nodes.map((item): FlowCanvasNode => ({ id: item.id, type: item.type || "message", position: item.position, data: { ...item.data } })),
    edges: edges.map((item): FlowCanvasEdge => ({ id: item.id, source: item.source, target: item.target, label: typeof item.label === "string" ? item.label : undefined })),
    entryNodeId: entry?.id || linearPath[0] || "",
    linearPath,
    legacyFallback: getFallback(nodes, edges)
  };
}

function fromCanvas(trigger: VisualAutomationTrigger): FlowSnapshot {
  return {
    nodes: trigger.nodes.map((item) => createNode(item.id, item.type, item.position.x, item.position.y, item.data)),
    edges: trigger.edges.map((item) => createEdge(item.source, item.target, item.label))
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
  if (node.type === "condition") return node.data.condition || "Condicao sem regra";
  if (node.data.category === "data") return `${node.data.variableName || "variavel"} = ${node.data.variableValue || "valor"}`;
  return actions.find((item) => item.id === node.data.actionType)?.label || "Acao";
}

const paletteGroups: { title: string; items: PaletteItem[] }[] = [
  {
    title: "Entradas",
    items: [
      { id: "incoming-message", icon: "IN", label: "Mensagem recebida", description: "Comeca quando alguem inicia uma conversa.", baseType: "entry", data: { label: "Mensagem recebida", nodeKindLabel: "Mensagem recebida", category: "trigger", channel: "whatsapp", triggerType: "new_message" } },
      { id: "new-lead", icon: "LEAD", label: "Novo lead", description: "Usa comentario ou campanha para abrir um fluxo.", baseType: "entry", data: { label: "Novo lead", nodeKindLabel: "Novo lead", category: "trigger", channel: "instagram", triggerType: "keyword", keyword: "quero" } }
    ]
  },
  {
    title: "Acoes",
    items: [
      { id: "send-message", icon: "MSG", label: "Enviar mensagem", description: "Resposta automatica com variaveis.", baseType: "message", data: { label: "Enviar mensagem", nodeKindLabel: "Enviar mensagem", category: "action", message: "Ola {{nome}}, recebi sua mensagem e vou te atender agora." } },
      { id: "wait", icon: "WAIT", label: "Esperar", description: "Cria uma pausa antes da proxima etapa.", baseType: "wait", data: { label: "Esperar", nodeKindLabel: "Esperar", category: "action", delayMinutes: 5 } },
      { id: "notify-team", icon: "TEAM", label: "Avisar equipe", description: "Faz o repasse para um humano.", baseType: "action", data: { label: "Avisar equipe", nodeKindLabel: "Avisar equipe", category: "action", actionType: "notify_team", message: "Lead pronto para atendimento humano." } }
    ]
  },
  {
    title: "Logica e dados",
    items: [
      { id: "condition", icon: "IF", label: "Condicao", description: "Filtra por palavra, contexto ou intencao.", baseType: "condition", data: { label: "Condicao", nodeKindLabel: "Condicao", category: "logic", condition: "contem preco" } },
      { id: "variable", icon: "VAR", label: "Setar variavel", description: "Guarda contexto para usar depois.", baseType: "action", data: { label: "Setar variavel", nodeKindLabel: "Setar variavel", category: "data", variableName: "origem_lead", variableValue: "instagram", actionType: "reply_same_channel" } }
    ]
  }
];

const templates = [
  {
    id: "lead-instagram",
    title: "Lead do Instagram",
    subtitle: "Capta o interesse, qualifica e leva para o canal certo.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Comentario no Instagram", channel: "instagram", triggerType: "keyword", keyword: "quero" }),
      createNode("message-1", "message", 320, 80, { label: "Resposta inicial", message: "Oi {{nome}}, vi seu interesse. Me diga em uma frase o que voce quer automatizar primeiro." }),
      createNode("wait-1", "wait", 640, 80, { label: "Esperar retorno", delayMinutes: 10 }),
      createNode("action-1", "action", 960, 80, { label: "Levar para WhatsApp", actionType: "handoff_whatsapp", message: "Perfeito. Vou continuar com voce no WhatsApp." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "wait-1"), createEdge("wait-1", "action-1")]
  },
  {
    id: "support-whatsapp",
    title: "Atendimento inicial",
    subtitle: "Recebe, responde e escala o atendimento quando precisar.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Nova mensagem", channel: "whatsapp", triggerType: "new_message" }),
      createNode("message-1", "message", 320, 80, { label: "Boas-vindas", message: "Ola {{nome}}, recebi sua mensagem e ja vou te ajudar." }),
      createNode("condition-1", "condition", 640, 80, { label: "Separar intencao", condition: "contem orcamento ou suporte" }),
      createNode("action-1", "action", 960, 80, { label: "Avisar equipe", actionType: "notify_team", message: "Cliente pediu atendimento humano." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "condition-1"), createEdge("condition-1", "action-1", "sim")]
  },
  {
    id: "reactivate",
    title: "Reengajar oportunidade",
    subtitle: "Volta a falar com quem parou no meio da conversa.",
    nodes: [
      createNode("entry-1", "entry", 0, 80, { label: "Lead parado", channel: "multi", triggerType: "keyword", keyword: "sem resposta" }),
      createNode("message-1", "message", 320, 80, { label: "Mensagem de retorno", message: "Oi {{nome}}, passei para ver se ainda faz sentido continuar por aqui." }),
      createNode("wait-1", "wait", 640, 80, { label: "Esperar resposta", delayMinutes: 60 }),
      createNode("message-2", "message", 960, 80, { label: "Ultimo toque", message: "Se preferir, posso te encaminhar direto para um atendente agora." })
    ],
    edges: [createEdge("entry-1", "message-1"), createEdge("message-1", "wait-1"), createEdge("wait-1", "message-2")]
  }
];

function FlowNodeCard({ data, type, selected }: NodeProps<StudioNode>) {
  const nodeType = type || "message";
  const metaItem = nodeMeta[nodeType];
  return (
    <div className={`flow-node-card flow-node-card-${metaItem.tone}${selected ? " flow-node-card-selected" : ""}`}>
      <Handle type="target" position={Position.Left} className="flow-node-handle" />
      <div className="flow-node-card-head">
        <span>{metaItem.icon}</span>
        <div>
          <strong>{data.label}</strong>
          <small>{data.nodeKindLabel || metaItem.label}</small>
        </div>
      </div>
      {data.category ? <span className={`flow-node-kind flow-node-kind-${data.category}`}>{data.category}</span> : null}
      <p>{getNodeSummary({ type: nodeType, data })}</p>
      <Handle type="source" position={Position.Right} className="flow-node-handle" />
    </div>
  );
}

const nodeTypes = { entry: FlowNodeCard, message: FlowNodeCard, wait: FlowNodeCard, condition: FlowNodeCard, action: FlowNodeCard };

function InspectorPanel({ nodeItem, onUpdate }: { nodeItem: StudioNode | null; onUpdate: (id: string, data: Partial<FlowNodeData>) => void }) {
  if (!nodeItem) {
    return (
      <section className="flow-inspector-panel">
        <span className="workspace-kicker">Editor de bloco</span>
        <div className="builder-empty-state">
          <strong>Escolha um bloco para editar</strong>
          <p className="mini">Clique no canvas para ajustar gatilho, texto, espera ou acao final.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-inspector-panel">
      <span className="workspace-kicker">Editor de bloco</span>
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
                {channels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <label className="flow-field">
              <span>Gatilho</span>
              <select className="select" value={nodeItem.data.triggerType || "new_message"} onChange={(event) => onUpdate(nodeItem.id, { triggerType: event.target.value as AutomationDetails["triggerType"] })}>
                {triggers.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
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
            <span>Respostas rapidas</span>
            <input className="input" value={nodeItem.data.quickReplies || ""} onChange={(event) => onUpdate(nodeItem.id, { quickReplies: event.target.value })} />
          </label>
          <div className="flow-variable-row">
            {variableTokens.map((token) => (
              <button key={token} type="button" onClick={() => onUpdate(nodeItem.id, { message: `${nodeItem.data.message || ""}${nodeItem.data.message ? " " : ""}${token}` })}>
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
          <span>Regra</span>
          <input className="input" value={nodeItem.data.condition || ""} onChange={(event) => onUpdate(nodeItem.id, { condition: event.target.value })} />
        </label>
      ) : null}

      {nodeItem.type === "action" ? (
        <>
          <label className="flow-field">
            <span>Tipo de acao</span>
            <select className="select" value={nodeItem.data.actionType || "reply_same_channel"} onChange={(event) => onUpdate(nodeItem.id, { actionType: event.target.value as AutomationDetails["actionType"] })}>
              {actions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="flow-field">
            <span>Mensagem complementar</span>
            <textarea className="textarea flow-message-box-small" value={nodeItem.data.message || ""} onChange={(event) => onUpdate(nodeItem.id, { message: event.target.value })} />
          </label>
          {nodeItem.data.category === "data" ? (
            <div className="flow-two-columns">
              <label className="flow-field">
                <span>Variavel</span>
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
  const boot = useMemo(() => readDraft(), []);
  const initialFlow = useMemo(() => cloneFlow({ nodes: templates[0].nodes, edges: templates[0].edges }), []);
  const [automations, setAutomations] = useState(initialAutomations);
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(boot?.nodes || initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StudioEdge>(boot?.edges || initialFlow.edges);
  const [name, setName] = useState(boot?.name || "Qualificacao automatica");
  const [status, setStatus] = useState(boot?.status || "Ativa");
  const [selectedId, setSelectedId] = useState<string | null>((boot?.nodes || initialFlow.nodes)[0]?.id || null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusText, setStatusText] = useState("Organize sua automacao com mais clareza.");
  const [draftVersion, setDraftVersion] = useState(boot?.version || 1);
  const [autosaveLabel, setAutosaveLabel] = useState(boot?.updatedAt ? `Salvo as ${boot.updatedAt}` : "Autosave ativo");
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");
  const [history, setHistory] = useState<FlowSnapshot[]>([]);
  const [future, setFuture] = useState<FlowSnapshot[]>([]);

  const selectedNode = useMemo(() => nodes.find((item) => item.id === selectedId) || null, [nodes, selectedId]);
  const validation = useMemo(() => validateFlow(nodes, edges), [nodes, edges]);
  const previewSteps = useMemo(() => getLinearPath(nodes, edges).map((id) => nodes.find((item) => item.id === id)).filter((item): item is StudioNode => Boolean(item)), [nodes, edges]);
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
      setAutosaveLabel(`Salvo as ${updatedAt}`);
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
    setStatusText(`Template aplicado: ${template.title}. Agora deixe o texto com a cara da sua operacao.`);
  }

  function addBlock(item: PaletteItem) {
    remember();
    const nextNode = createNode(`${item.baseType}-${Date.now()}`, item.baseType, 140 + nodes.length * 40, 130 + nodes.length * 30, { ...item.data });
    setNodes((current) => [...current, nextNode]);
    setSelectedId(nextNode.id);
    setStatusText(`Bloco adicionado: ${item.label}.`);
  }

  function duplicateSelectedNode() {
    const selected = nodes.find((item) => item.id === selectedId);
    if (!selected) return;
    remember();
    const copy = { ...selected, id: `${selected.type}-copy-${Date.now()}`, position: { x: selected.position.x + 44, y: selected.position.y + 44 }, data: { ...selected.data, label: `${selected.data.label} copia` } };
    setNodes((current) => [...current, copy]);
    setSelectedId(copy.id);
    setStatusText("Bloco duplicado com sucesso.");
  }

  function updateNodeData(id: string, data: Partial<FlowNodeData>) {
    remember();
    setNodes((current) => current.map((item) => (item.id === id ? { ...item, data: { ...item.data, ...data } } : item)));
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
    const primaryMessage = previewSteps.find((item) => item.type === "message")?.data.message || "Mensagem automatica da Klio.";

    setSaving(true);
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
    setSaving(false);
    if (!response.ok) return setStatusText(data.error || "Nao foi possivel salvar o fluxo.");

    setAutomations((current) => [data.automation, ...current]);
    setTestingId(data.automation.id);
    setStatus(finalStatus);
    setStatusText(validation.valid ? (finalStatus === "Ativa" ? "Fluxo publicado com sucesso." : "Fluxo salvo como rascunho.") : "Fluxo salvo como rascunho. Ajuste os pontos pendentes antes de publicar.");
  }

  async function testFlow() {
    if (!testingId) return setStatusText("Selecione ou salve um fluxo antes de testar.");
    if (!testRecipient.trim()) return setStatusText("Informe um destino de teste.");

    setTesting(true);
    const response = await fetch("/api/automations/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        automationId: testingId,
        recipient: testRecipient,
        contactName: testContactName,
        channel: nodes.find((item) => item.type === "entry")?.data.channel || "whatsapp"
      })
    });
    const data = await response.json();
    setTesting(false);
    setStatusText(response.ok ? data.preview || "Teste concluido." : data.error || "Falha ao testar fluxo.");
  }

  return (
    <section className="flow-studio-v2">
      <section className="flow-overview-strip">
        <div className="flow-overview-hero">
          <span className="workspace-kicker">Flow Studio</span>
          <h2>Automacoes com mais contexto, menos confusao visual.</h2>
          <p>Templates, canvas e edicao agora ficam mais separados para voce montar a operacao sem se perder na tela.</p>
        </div>
        <div className="flow-overview-grid">
          <div className="flow-overview-card"><span>Fluxos salvos</span><strong>{automations.length}</strong><small>Biblioteca pronta para reaproveitar.</small></div>
          <div className="flow-overview-card"><span>Ativos</span><strong>{activeCount}</strong><small>Fluxos que podem rodar agora.</small></div>
          <div className="flow-overview-card"><span>Rascunhos</span><strong>{draftCount}</strong><small>Automacoes aguardando revisao.</small></div>
          <div className="flow-overview-card"><span>Templates</span><strong>{templates.length}</strong><small>Atalhos para comecar sem travar.</small></div>
        </div>
      </section>

      <section className="flow-workbench">
        <aside className="flow-workbench-rail">
          <section className="flow-rail-card">
            <div className="flow-rail-head">
              <div><span className="workspace-kicker">Inicio rapido</span><strong>Escolha um template</strong></div>
              <span className="mini">{templates.length} modelos</span>
            </div>
            <div className="flow-template-grid flow-template-grid-rail">
              {templates.map((template) => (
                <button className="flow-template-card" key={template.id} type="button" onClick={() => applyTemplate(template.id)}>
                  <span>template</span>
                  <strong>{template.title}</strong>
                  <p>{template.subtitle}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="flow-rail-card">
            <div className="flow-rail-head">
              <div><span className="workspace-kicker">Biblioteca de blocos</span><strong>Adicione etapas sem poluicao</strong></div>
            </div>
            <div className="flow-builder-toolbar">
              <div className="flow-toolbar-actions">
                <button className="btn btn-secondary" disabled={!selectedNode} onClick={duplicateSelectedNode} type="button">Duplicar</button>
                <button className="btn btn-secondary" disabled={!history.length} onClick={undo} type="button">Desfazer</button>
                <button className="btn btn-secondary" disabled={!future.length} onClick={redo} type="button">Refazer</button>
              </div>
              {paletteGroups.map((group) => (
                <div className="flow-toolbar-group" key={group.title}>
                  <span>{group.title}</span>
                  <div className="flow-toolbar-grid">
                    {group.items.map((item) => (
                      <button className="flow-toolbar-node" key={item.id} type="button" onClick={() => addBlock(item)}>
                        <strong>{item.icon}</strong>
                        <div><span>{item.label}</span><small>{item.description}</small></div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flow-rail-card">
            <div className="flow-rail-head">
              <div><span className="workspace-kicker">Biblioteca</span><strong>Fluxos que voce ja montou</strong></div>
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
                  <p className="mini">Monte uma automacao visual e salve para reaproveitar depois.</p>
                </div>
              )}
            </div>
          </section>
        </aside>

        <form className="flow-workbench-main flow-workbench-main-v2" onSubmit={saveFlow}>
          <div className="flow-command-bar">
            <div className="flow-command-copy">
              <span className="workspace-kicker">Canvas principal</span>
              <strong>{name}</strong>
              <p>{statusText}</p>
            </div>
            <div className="flow-command-actions">
              <span className="flow-autosave-chip">v{draftVersion} · {autosaveLabel}</span>
              <input aria-label="Nome do fluxo" className="input" value={name} onChange={(event) => setName(event.target.value)} />
              <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="Ativa">Ativa</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </div>
          </div>

          <div className="flow-canvas-frame">
            <div className="flow-canvas-note">
              <span>Entrada</span>
              <span>Mensagem</span>
              <span>Espera</span>
              <span>Acao</span>
            </div>
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
                <Background color="rgba(129,140,248,0.16)" gap={26} />
                <MiniMap pannable zoomable className="flow-minimap" />
                <Controls className="flow-controls" />
              </ReactFlow>
            </div>
          </div>

          <div className="flow-studio-bottom">
            <div className={`flow-validation-panel${validation.valid ? " flow-validation-panel-valid" : ""}`}>
              <strong>{validation.valid ? "Fluxo pronto para publicar" : "Ajustes antes de publicar"}</strong>
              {validation.issues.length ? (
                <ul>{validation.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
              ) : (
                <p className="mini">Entrada, mensagem e caminho principal estao conectados.</p>
              )}
            </div>
            <div className="flow-actions">
              <button className="btn btn-secondary" disabled={saving} type="submit" value="Rascunho">Salvar rascunho</button>
              <button className="btn btn-primary" disabled={saving} type="submit" value="Ativa">{saving ? "Publicando..." : "Publicar fluxo"}</button>
            </div>
          </div>
        </form>

        <aside className="flow-studio-side">
          <InspectorPanel nodeItem={selectedNode} onUpdate={updateNodeData} />

          <section className="flow-inspector-panel">
            <span className="workspace-kicker">Preview da conversa</span>
            <div className="flow-chat">
              <div className="flow-chat-bubble flow-chat-bubble-user">
                <span>Cliente</span>
                <p>{fallback.triggerType === "new_message" ? "Ola, preciso de ajuda" : fallback.keyword || "quero"}</p>
              </div>
              {previewSteps
                .filter((item) => item.type !== "entry" && item.type !== "condition")
                .map((item) =>
                  item.type === "wait" ? (
                    <div className="flow-chat-wait" key={item.id}>
                      espera de {item.data.delayMinutes || 0} min
                    </div>
                  ) : (
                    <div className="flow-chat-bubble flow-chat-bubble-bot" key={item.id}>
                      <span>{item.type === "action" ? "Acao" : "Klio"}</span>
                      <p>{getNodeSummary(item)}</p>
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
                  )
                )}
            </div>
          </section>

          <section className="flow-inspector-panel">
            <div className="command-panel-head">
              <strong>Teste rapido</strong>
              <span className="mini">Executa sem republicar</span>
            </div>
            <label className="flow-field">
              <span>Fluxo para testar</span>
              <select className="select" value={testingId} onChange={(event) => setTestingId(event.target.value)}>
                <option value="">Selecione um fluxo</option>
                {automations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
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
            <button className="btn btn-secondary flow-test-button" disabled={testing} onClick={testFlow} type="button">
              {testing ? "Testando..." : "Executar teste"}
            </button>
          </section>
        </aside>
      </section>
    </section>
  );
}
