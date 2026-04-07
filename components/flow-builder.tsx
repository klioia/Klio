"use client";

import { FormEvent, useState } from "react";

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

export function FlowBuilder({ initialAutomations }: FlowBuilderProps) {
  const [automations, setAutomations] = useState(initialAutomations);
  const [name, setName] = useState("Qualificacao automatica de lead");
  const [channel, setChannel] = useState("instagram");
  const [triggerType, setTriggerType] = useState("keyword");
  const [keyword, setKeyword] = useState("quero");
  const [actionType, setActionType] = useState("handoff_whatsapp");
  const [message, setMessage] = useState(
    "Oi {{nome}}, vi seu interesse e posso te ajudar por aqui. Me diz rapidamente o que voce quer automatizar primeiro."
  );
  const [secondMessage, setSecondMessage] = useState("Perfeito. Se fizer sentido, eu tambem posso te encaminhar para nosso especialista com o contexto da conversa.");
  const [delayMinutes, setDelayMinutes] = useState("10");
  const [statusText, setStatusText] = useState("");
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState("");

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
      setStatusText(data.error || "Nao foi possivel salvar o fluxo.");
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

    setStatusText("Testando fluxo...");

    const response = await fetch("/api/automations/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        automationId: testingId,
        recipient: "5511999999999",
        contactName: "Cliente Demo",
        channel
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatusText(data.error || "Falha ao testar fluxo.");
      return;
    }

    setStatusText(data.preview ? `Teste pronto: ${data.preview}` : "Fluxo executado.");
  }

  return (
    <div className="grid-2" style={{ gap: 24 }}>
      <form className="card panel" onSubmit={handleSave}>
        <strong>Construtor de automacao</strong>
        <p className="mini" style={{ marginTop: 10 }}>
          Estruture o fluxo como um mini builder operacional: gatilho, resposta do bot e proxima etapa.
        </p>
        <div className="grid-2" style={{ marginTop: 18 }}>
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
              <option value="multi">Multi-canal</option>
            </select>
          </label>
          <label>
            <span className="mini">Gatilho</span>
            <select className="select" onChange={(event) => setTriggerType(event.target.value)} value={triggerType}>
              <option value="keyword">Palavra-chave</option>
              <option value="new_message">Nova mensagem</option>
            </select>
          </label>
          <label>
            <span className="mini">Acao</span>
            <select className="select" onChange={(event) => setActionType(event.target.value)} value={actionType}>
              <option value="handoff_whatsapp">Mover para WhatsApp</option>
              <option value="reply_same_channel">Responder no mesmo canal</option>
              <option value="notify_team">Notificar equipe</option>
            </select>
          </label>
        </div>
        {triggerType === "keyword" ? (
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Palavra-chave</span>
            <input className="input" onChange={(event) => setKeyword(event.target.value)} value={keyword} />
          </label>
        ) : null}
        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Mensagem inicial</span>
          <textarea className="textarea" onChange={(event) => setMessage(event.target.value)} value={message} />
        </label>
        <div className="grid-2" style={{ marginTop: 18 }}>
          <label>
            <span className="mini">Espera da 2a etapa (min)</span>
            <input className="input" onChange={(event) => setDelayMinutes(event.target.value)} value={delayMinutes} />
          </label>
          <label>
            <span className="mini">2a etapa opcional</span>
            <input
              className="input"
              onChange={(event) => setSecondMessage(event.target.value)}
              value={secondMessage}
            />
          </label>
        </div>
        <div className="builder-preview" style={{ marginTop: 18 }}>
          <div className="builder-node">
            <span className="mini">Trigger</span>
            <strong>{triggerType === "keyword" ? `Palavra-chave: ${keyword}` : "Nova mensagem recebida"}</strong>
          </div>
          <div className="builder-arrow">→</div>
          <div className="builder-node">
            <span className="mini">Bot</span>
            <strong>{message}</strong>
          </div>
          <div className="builder-arrow">→</div>
          <div className="builder-node builder-node-soft">
            <span className="mini">2a etapa</span>
            <strong>{secondMessage || "Sem segunda etapa"}</strong>
          </div>
        </div>
        {statusText ? <p className="mini" style={{ marginTop: 16 }}>{statusText}</p> : null}
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
          <strong>Fluxos criados</strong>
          <div className="flow-list" style={{ marginTop: 18 }}>
            {automations.map((item) => (
              <div className="flow-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <div className="mini">{item.channel} • fluxo ativo para chatbot e webhook</div>
                </div>
                <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
