"use client";

import { FormEvent, useMemo, useState } from "react";

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
  const [testingId, setTestingId] = useState(initialAutomations[0]?.id || "");
  const [testRecipient, setTestRecipient] = useState("");
  const [testContactName, setTestContactName] = useState("Cliente teste");

  const summary = useMemo(
    () => [
      `Canal: ${channelLabel(channel)}`,
      `Gatilho: ${triggerLabel(triggerType, keyword)}`,
      `Ação principal: ${actionLabel(actionType)}`,
      secondMessage ? `Segunda etapa após ${delayMinutes || "0"} min` : "Sem segunda etapa"
    ],
    [actionType, channel, delayMinutes, keyword, secondMessage, triggerType]
  );

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
    setStatusText("Fluxo salvo com sucesso.");
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

    setStatusText("Testando fluxo...");

    const response = await fetch("/api/automations/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        automationId: testingId,
        recipient: testRecipient,
        contactName: testContactName,
        channel
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatusText(data.error || "Falha ao testar fluxo.");
      return;
    }

    setStatusText(data.preview ? `Teste concluído: ${data.preview}` : "Fluxo executado com sucesso.");
  }

  return (
    <div className="builder-layout">
      <form className="card panel builder-form" onSubmit={handleSave}>
        <div className="builder-section-header">
          <div>
            <strong>Construtor de fluxos</strong>
            <p className="mini" style={{ marginTop: 8 }}>
              Monte a lógica principal da conversa, defina a resposta inicial e prepare o próximo passo do atendimento.
            </p>
          </div>
          <span className="pricing-badge pricing-badge-featured">builder</span>
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
          <button className="btn btn-secondary" onClick={handleTest} type="button">
            Testar fluxo
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
        </section>

        <section className="card panel">
          <strong>Fluxos criados</strong>
          <div className="flow-list" style={{ marginTop: 18 }}>
            {automations.length ? (
              automations.map((item) => (
                <div className="flow-item flow-item-rich" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <div className="mini">{channelLabel(item.channel)} · fluxo ativo na operação</div>
                  </div>
                  <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                </div>
              ))
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
