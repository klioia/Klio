"use client";

import { FormEvent, useMemo, useState } from "react";
import { decodeTrigger } from "@/lib/automation-utils";

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

type Template = {
  id: string;
  title: string;
  subtitle: string;
  name: string;
  channel: string;
  triggerType: string;
  keyword: string;
  actionType: string;
  message: string;
  secondMessage: string;
  delayMinutes: string;
};

const templates: Template[] = [
  {
    id: "lead",
    title: "Qualificar lead",
    subtitle: "Captura intenção e encaminha",
    name: "Qualificação automática de lead",
    channel: "instagram",
    triggerType: "keyword",
    keyword: "quero",
    actionType: "handoff_whatsapp",
    message: "Oi, vi seu interesse e posso te ajudar por aqui. Me conte rapidamente o que você quer automatizar primeiro.",
    secondMessage: "Perfeito. Agora vou te encaminhar para um especialista com todo o contexto da conversa.",
    delayMinutes: "10"
  },
  {
    id: "support",
    title: "Atendimento inicial",
    subtitle: "Responde no próprio canal",
    name: "Primeira resposta automática",
    channel: "whatsapp",
    triggerType: "new_message",
    keyword: "",
    actionType: "reply_same_channel",
    message: "Olá. Recebi sua mensagem e já vou te ajudar. Me diga em uma frase o que você precisa agora.",
    secondMessage: "Se preferir, também posso repassar seu atendimento para uma pessoa da equipe.",
    delayMinutes: "5"
  },
  {
    id: "alerts",
    title: "Avisar equipe",
    subtitle: "Notifica o time quando entrar oportunidade",
    name: "Alerta interno de oportunidade",
    channel: "multi",
    triggerType: "keyword",
    keyword: "orçamento",
    actionType: "notify_team",
    message: "Recebi seu pedido e a equipe já foi avisada para continuar o atendimento.",
    secondMessage: "",
    delayMinutes: "0"
  }
];

function channelLabel(channel: string) {
  switch (channel) {
    case "instagram":
      return "Instagram";
    case "whatsapp":
      return "WhatsApp";
    case "messenger":
      return "Messenger";
    case "telegram":
      return "Telegram";
    case "multi":
      return "Multicanal";
    default:
      return channel;
  }
}

function triggerLabel(triggerType: string, keyword: string) {
  if (triggerType === "keyword") {
    return `Palavra-chave: ${keyword || "defina um termo"}`;
  }

  return "Nova mensagem recebida";
}

function actionLabel(actionType: string) {
  switch (actionType) {
    case "handoff_whatsapp":
      return "Encaminhar para WhatsApp";
    case "reply_same_channel":
      return "Responder no mesmo canal";
    case "notify_team":
      return "Notificar a equipe";
    default:
      return actionType;
  }
}

function decodeAutomation(item: AutomationItem) {
  return decodeTrigger(item.trigger);
}

export function FlowBuilder({ initialAutomations }: FlowBuilderProps) {
  const [automations, setAutomations] = useState(initialAutomations);
  const [name, setName] = useState("Qualificação automática de lead");
  const [channel, setChannel] = useState("instagram");
  const [triggerType, setTriggerType] = useState("keyword");
  const [keyword, setKeyword] = useState("quero");
  const [actionType, setActionType] = useState("handoff_whatsapp");
  const [message, setMessage] = useState(
    "Oi, vi seu interesse e posso te ajudar por aqui. Me conte rapidamente o que você quer automatizar primeiro."
  );
  const [secondMessage, setSecondMessage] = useState(
    "Perfeito. Se fizer sentido, também posso encaminhar você para um especialista com todo o contexto da conversa."
  );
  const [delayMinutes, setDelayMinutes] = useState("10");
  const [statusText, setStatusText] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");

  const selectedAutomation = useMemo(
    () => automations.find((item) => item.id === testingId) || null,
    [automations, testingId]
  );

  const selectedAutomationDetails = useMemo(
    () => (selectedAutomation ? decodeAutomation(selectedAutomation) : null),
    [selectedAutomation]
  );

  const summary = useMemo(
    () => [
      `Canal: ${channelLabel(channel)}`,
      `Gatilho: ${triggerLabel(triggerType, keyword)}`,
      `Ação principal: ${actionLabel(actionType)}`,
      secondMessage ? `Segunda etapa após ${delayMinutes || "0"} min` : "Sem segunda etapa"
    ],
    [actionType, channel, delayMinutes, keyword, secondMessage, triggerType]
  );

  function applyTemplate(template: Template) {
    setName(template.name);
    setChannel(template.channel);
    setTriggerType(template.triggerType);
    setKeyword(template.keyword);
    setActionType(template.actionType);
    setMessage(template.message);
    setSecondMessage(template.secondMessage);
    setDelayMinutes(template.delayMinutes);
    setStatusText(`Template aplicado: ${template.title}.`);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatusText("");

    const response = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        channel,
        triggerType,
        keyword,
        actionType,
        secondMessage,
        delayMinutes: Number(delayMinutes || 0),
        status: "Ativa",
        message
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
    setStatusText("Fluxo salvo com sucesso e pronto para teste.");
    setSaving(false);
  }

  async function handleTest() {
    if (!testingId) {
      setStatusText("Salve um fluxo primeiro para testar.");
      return;
    }

    if (!testRecipient.trim()) {
      setStatusText("Informe um destinatário para executar o teste.");
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
        channel: selectedAutomation?.channel || channel
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
    <div className="builder-layout">
      <form className="card panel builder-form" onSubmit={handleSave}>
        <div className="builder-section-header">
          <div>
            <strong>Construtor de fluxos</strong>
            <p className="mini" style={{ marginTop: 8 }}>
              Crie um fluxo rápido, reutilize templates e teste tudo sem sair do painel.
            </p>
          </div>
          <span className="pricing-badge pricing-badge-featured">builder</span>
        </div>

        <div className="builder-block">
          <div className="builder-block-title">Comece mais rápido</div>
          <div className="builder-template-grid" style={{ marginTop: 16 }}>
            {templates.map((template) => (
              <button
                className="builder-template"
                key={template.id}
                onClick={() => applyTemplate(template)}
                type="button"
              >
                <strong>{template.title}</strong>
                <span className="mini">{template.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block-title">Identidade do fluxo</div>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <label>
              <span className="mini">Nome do fluxo</span>
              <input className="input" onChange={(event) => setName(event.target.value)} value={name} />
            </label>
            <label>
              <span className="mini">Canal</span>
              <select className="select" onChange={(event) => setChannel(event.target.value)} value={channel}>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="messenger">Messenger</option>
                <option value="telegram">Telegram</option>
                <option value="multi">Multicanal</option>
              </select>
            </label>
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block-title">Entrada e decisão</div>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <label>
              <span className="mini">Tipo de gatilho</span>
              <select className="select" onChange={(event) => setTriggerType(event.target.value)} value={triggerType}>
                <option value="keyword">Palavra-chave</option>
                <option value="new_message">Nova mensagem</option>
              </select>
            </label>
            <label>
              <span className="mini">Ação principal</span>
              <select className="select" onChange={(event) => setActionType(event.target.value)} value={actionType}>
                <option value="handoff_whatsapp">Encaminhar para WhatsApp</option>
                <option value="reply_same_channel">Responder no mesmo canal</option>
                <option value="notify_team">Notificar equipe</option>
              </select>
            </label>
          </div>
          {triggerType === "keyword" ? (
            <label style={{ display: "block", marginTop: 16 }}>
              <span className="mini">Palavra-chave</span>
              <input className="input" onChange={(event) => setKeyword(event.target.value)} value={keyword} />
            </label>
          ) : null}
        </div>

        <div className="builder-block">
          <div className="builder-block-title">Mensagens da automação</div>
          <label style={{ display: "block", marginTop: 16 }}>
            <span className="mini">Mensagem inicial</span>
            <textarea className="textarea" onChange={(event) => setMessage(event.target.value)} value={message} />
          </label>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <label>
              <span className="mini">Espera da segunda etapa (min)</span>
              <input className="input" onChange={(event) => setDelayMinutes(event.target.value)} value={delayMinutes} />
            </label>
            <label>
              <span className="mini">Segunda etapa opcional</span>
              <input className="input" onChange={(event) => setSecondMessage(event.target.value)} value={secondMessage} />
            </label>
          </div>
        </div>

        <div className="builder-preview premium-preview" style={{ marginTop: 18 }}>
          <div className="builder-node">
            <span className="mini">Entrada</span>
            <strong>{triggerLabel(triggerType, keyword)}</strong>
          </div>
          <div className="builder-arrow">{`->`}</div>
          <div className="builder-node">
            <span className="mini">Resposta</span>
            <strong>{message}</strong>
          </div>
          <div className="builder-arrow">{`->`}</div>
          <div className="builder-node builder-node-soft">
            <span className="mini">Próximo passo</span>
            <strong>{secondMessage || "Sem segunda etapa"}</strong>
          </div>
        </div>

        <div className="builder-summary-grid">
          {summary.map((item) => (
            <div className="builder-summary-card" key={item}>
              <strong>{item}</strong>
            </div>
          ))}
        </div>

        {statusText ? <p className="mini builder-status">{statusText}</p> : null}
        <div className="cta-row" style={{ marginTop: 18 }}>
          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? "Salvando..." : "Salvar fluxo"}
          </button>
          <button className="btn btn-secondary" disabled={testing} onClick={handleTest} type="button">
            {testing ? "Testando..." : "Testar fluxo"}
          </button>
        </div>
      </form>

      <div className="flow-list">
        <section className="card panel">
          <strong>Teste rápido</strong>
          <div className="grid-2" style={{ marginTop: 18 }}>
            <label>
              <span className="mini">Fluxo para testar</span>
              <select className="select" onChange={(event) => setTestingId(event.target.value)} value={testingId}>
                <option value="">Selecione um fluxo</option>
                {automations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="mini">Nome do contato</span>
              <input className="input" value={testContactName} onChange={(event) => setTestContactName(event.target.value)} />
            </label>
          </div>
          <label style={{ display: "block", marginTop: 16 }}>
            <span className="mini">Destino do teste</span>
            <input
              className="input"
              placeholder="5511999999999"
              value={testRecipient}
              onChange={(event) => setTestRecipient(event.target.value)}
            />
          </label>

          {selectedAutomation ? (
            <div className="builder-selected-flow">
              <div className="flow-item flow-item-rich">
                <div>
                  <strong>{selectedAutomation.name}</strong>
                  <div className="mini">
                    {channelLabel(selectedAutomation.channel)} · {selectedAutomation.status}
                  </div>
                </div>
                <span className="tag tag-success">selecionado</span>
              </div>
              <div className="builder-selected-meta">
                <div className="builder-summary-card">
                  <span className="mini">Gatilho</span>
                  <strong>{triggerLabel(selectedAutomationDetails?.triggerType || "new_message", selectedAutomationDetails?.keyword || "")}</strong>
                </div>
                <div className="builder-summary-card">
                  <span className="mini">Ação</span>
                  <strong>{actionLabel(selectedAutomationDetails?.actionType || "reply_same_channel")}</strong>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="card panel">
          <div className="flow-item">
            <strong>Fluxos criados</strong>
            <span className="mini">{automations.length} no total</span>
          </div>
          <div className="flow-list" style={{ marginTop: 18 }}>
            {automations.length ? (
              automations.map((item) => {
                const details = decodeAutomation(item);
                return (
                  <button
                    className={`flow-item flow-item-rich flow-item-button${testingId === item.id ? " flow-item-button-active" : ""}`}
                    key={item.id}
                    onClick={() => setTestingId(item.id)}
                    type="button"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <div className="mini">
                        {channelLabel(item.channel)} · {triggerLabel(details.triggerType, details.keyword || "")}
                      </div>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </button>
                );
              })
            ) : (
              <div className="builder-empty-state">
                <strong>Nenhum fluxo salvo ainda</strong>
                <p className="mini">Crie seu primeiro fluxo para começar a testar a operação da Klio.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
