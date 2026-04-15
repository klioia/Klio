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
  useCase: string;
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
    title: "Capturar lead",
    subtitle: "Comentário ou DM vira conversa qualificada.",
    useCase: "Vendas",
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
    subtitle: "Responde a primeira mensagem e organiza o pedido.",
    useCase: "Suporte",
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
    subtitle: "Quando surgir oportunidade, o time recebe contexto.",
    useCase: "Operação",
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

const channelOptions = [
  { id: "instagram", label: "Instagram", description: "DM, comentário e lead social" },
  { id: "whatsapp", label: "WhatsApp", description: "Atendimento e fechamento" },
  { id: "messenger", label: "Messenger", description: "Caixa de entrada Meta" },
  { id: "telegram", label: "Telegram", description: "Comunidades e suporte" },
  { id: "multi", label: "Multicanal", description: "Usar em qualquer canal" }
];

const triggerOptions = [
  { id: "keyword", label: "Palavra-chave", description: "Quando o cliente escreve um termo" },
  { id: "new_message", label: "Nova mensagem", description: "Sempre que uma conversa entrar" }
];

const actionOptions = [
  { id: "reply_same_channel", label: "Responder no canal", description: "A Klio responde onde o cliente chamou" },
  { id: "handoff_whatsapp", label: "Levar para WhatsApp", description: "Conduz o lead para o fechamento" },
  { id: "notify_team", label: "Avisar equipe", description: "Cria uma tarefa interna para o time" }
];

function channelLabel(channel: string) {
  return channelOptions.find((item) => item.id === channel)?.label || channel;
}

function triggerLabel(triggerType: string, keyword: string) {
  if (triggerType === "keyword") {
    return keyword ? `Palavra-chave "${keyword}"` : "Palavra-chave a definir";
  }

  return "Nova mensagem recebida";
}

function actionLabel(actionType: string) {
  return actionOptions.find((item) => item.id === actionType)?.label || actionType;
}

function decodeAutomation(item: AutomationItem) {
  return decodeTrigger(item.trigger);
}

function OptionButton({
  active,
  title,
  description,
  onClick
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button className={`flow-option${active ? " flow-option-active" : ""}`} type="button" onClick={onClick}>
      <span className="flow-option-dot" />
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
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
  const [status, setStatus] = useState("Ativa");
  const [activeTemplate, setActiveTemplate] = useState("lead");
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

  const flowReadiness = useMemo(() => {
    let score = 0;
    if (name.trim()) score += 25;
    if (channel) score += 20;
    if (triggerType === "new_message" || keyword.trim()) score += 20;
    if (message.trim()) score += 25;
    if (status === "Ativa") score += 10;
    return score;
  }, [channel, keyword, message, name, status, triggerType]);

  const summary = useMemo(
    () => [
      { label: "Canal", value: channelLabel(channel) },
      { label: "Entrada", value: triggerLabel(triggerType, keyword) },
      { label: "Ação", value: actionLabel(actionType) },
      { label: "Status", value: status },
      { label: "Próxima etapa", value: secondMessage ? `Após ${delayMinutes || "0"} min` : "Desativada" }
    ],
    [actionType, channel, delayMinutes, keyword, secondMessage, status, triggerType]
  );

  function applyTemplate(template: Template) {
    setActiveTemplate(template.id);
    setName(template.name);
    setChannel(template.channel);
    setTriggerType(template.triggerType);
    setKeyword(template.keyword);
    setActionType(template.actionType);
    setMessage(template.message);
    setSecondMessage(template.secondMessage);
    setDelayMinutes(template.delayMinutes);
    setStatus("Ativa");
    setStatusText(`Modelo aplicado: ${template.title}. Revise a mensagem e publique quando estiver pronto.`);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const requestedStatus = submitter?.value || status;
    setSaving(true);
    setStatusText("");
    setStatus(requestedStatus);

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
        status: requestedStatus,
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
    setStatusText(requestedStatus === "Ativa" ? "Fluxo publicado e pronto para teste." : "Rascunho salvo para revisar depois.");
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
    <section className="flow-builder-command">
      <form className="flow-builder-console" onSubmit={handleSave}>
        <div className="flow-builder-hero">
          <div>
            <span className="workspace-kicker">Flow Studio</span>
            <h2>Monte um fluxo sem pensar em lógica técnica.</h2>
            <p>
              Escolha um modelo, ajuste a entrada da conversa, escreva a resposta e teste antes de publicar.
            </p>
          </div>
          <div className="flow-readiness">
            <span>Pronto para publicar</span>
            <strong>{flowReadiness}%</strong>
            <div className="flow-readiness-bar">
              <span style={{ width: `${flowReadiness}%` }} />
            </div>
          </div>
        </div>

        <div className="flow-builder-section">
          <div className="flow-section-heading">
            <span>01</span>
            <div>
              <strong>Escolha um ponto de partida</strong>
              <p>Modelos prontos reduzem erro e aceleram a configuração.</p>
            </div>
          </div>
          <div className="flow-template-grid">
            {templates.map((template) => (
              <button
                className={`flow-template-card${activeTemplate === template.id ? " flow-template-card-active" : ""}`}
                key={template.id}
                onClick={() => applyTemplate(template)}
                type="button"
              >
                <span>{template.useCase}</span>
                <strong>{template.title}</strong>
                <p>{template.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flow-builder-section">
          <div className="flow-section-heading">
            <span>02</span>
            <div>
              <strong>Defina onde o fluxo começa</strong>
              <p>Escolha o canal e a condição que inicia a automação.</p>
            </div>
          </div>
          <label className="flow-field">
            <span>Nome do fluxo</span>
            <input className="input" onChange={(event) => setName(event.target.value)} value={name} />
          </label>
          <div className="flow-option-grid">
            {channelOptions.map((item) => (
              <OptionButton
                active={channel === item.id}
                description={item.description}
                key={item.id}
                onClick={() => setChannel(item.id)}
                title={item.label}
              />
            ))}
          </div>
          <div className="flow-option-grid flow-option-grid-compact">
            {triggerOptions.map((item) => (
              <OptionButton
                active={triggerType === item.id}
                description={item.description}
                key={item.id}
                onClick={() => setTriggerType(item.id)}
                title={item.label}
              />
            ))}
          </div>
          {triggerType === "keyword" ? (
            <label className="flow-field">
              <span>Palavra que inicia o fluxo</span>
              <input className="input" onChange={(event) => setKeyword(event.target.value)} value={keyword} placeholder="Ex: quero, orçamento, preço" />
            </label>
          ) : null}
        </div>

        <div className="flow-builder-section">
          <div className="flow-section-heading">
            <span>03</span>
            <div>
              <strong>Escolha o que a Klio faz</strong>
              <p>Defina se a plataforma responde, encaminha ou avisa sua equipe.</p>
            </div>
          </div>
          <div className="flow-option-grid flow-option-grid-compact">
            {actionOptions.map((item) => (
              <OptionButton
                active={actionType === item.id}
                description={item.description}
                key={item.id}
                onClick={() => setActionType(item.id)}
                title={item.label}
              />
            ))}
          </div>
          <label className="flow-field">
            <span>Mensagem principal</span>
            <textarea className="textarea flow-message-box" onChange={(event) => setMessage(event.target.value)} value={message} />
          </label>
          <div className="flow-two-columns">
            <label className="flow-field">
              <span>Espera da próxima etapa</span>
              <input className="input" onChange={(event) => setDelayMinutes(event.target.value)} value={delayMinutes} inputMode="numeric" />
            </label>
            <label className="flow-field">
              <span>Status do fluxo</span>
              <select className="select" onChange={(event) => setStatus(event.target.value)} value={status}>
                <option value="Ativa">Ativa</option>
                <option value="Rascunho">Rascunho</option>
              </select>
            </label>
          </div>
          <label className="flow-field">
            <span>Mensagem de continuação opcional</span>
            <textarea className="textarea flow-message-box flow-message-box-small" onChange={(event) => setSecondMessage(event.target.value)} value={secondMessage} />
          </label>
        </div>

        <div className="flow-builder-footer">
          {statusText ? <p className="flow-status-message">{statusText}</p> : <p className="flow-status-message">Tudo que você editar aparece no preview antes de salvar.</p>}
          <div className="flow-actions">
            <button className="btn btn-secondary" disabled={saving} type="submit" name="saveStatus" value="Rascunho">
              Salvar como rascunho
            </button>
            <button className="btn btn-primary" disabled={saving} type="submit" name="saveStatus" value="Ativa">
              {saving ? "Publicando..." : status === "Ativa" ? "Publicar fluxo" : "Salvar fluxo"}
            </button>
          </div>
        </div>
      </form>

      <aside className="flow-inspector">
        <section className="flow-phone-preview">
          <div className="flow-phone-head">
            <div>
              <strong>Preview da conversa</strong>
              <span>{channelLabel(channel)} · {triggerLabel(triggerType, keyword)}</span>
            </div>
            <span className={status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{status}</span>
          </div>
          <div className="flow-chat">
            <div className="flow-chat-bubble flow-chat-bubble-user">
              <span>Cliente</span>
              <p>{triggerType === "keyword" ? keyword || "quero" : "Olá, preciso de ajuda"}</p>
            </div>
            <div className="flow-chat-bubble flow-chat-bubble-bot">
              <span>Klio</span>
              <p>{message || "Escreva a mensagem principal do bot."}</p>
            </div>
            {secondMessage ? (
              <div className="flow-chat-bubble flow-chat-bubble-bot flow-chat-bubble-soft">
                <span>Klio · após {delayMinutes || "0"} min</span>
                <p>{secondMessage}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="flow-summary-panel">
          <div className="command-panel-head">
            <strong>Resumo do fluxo</strong>
            <span className="workspace-chip">sem código</span>
          </div>
          <div className="flow-summary-list">
            {summary.map((item) => (
              <div className="flow-summary-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="flow-test-panel">
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
              <span>
                {channelLabel(selectedAutomation.channel)} · {triggerLabel(selectedAutomationDetails?.triggerType || "new_message", selectedAutomationDetails?.keyword || "")}
              </span>
            </div>
          ) : null}
          <button className="btn btn-secondary flow-test-button" disabled={testing} onClick={handleTest} type="button">
            {testing ? "Testando..." : "Enviar teste"}
          </button>
        </section>

        <section className="flow-library-panel">
          <div className="command-panel-head">
            <strong>Fluxos criados</strong>
            <span className="mini">{automations.length} no total</span>
          </div>
          <div className="flow-library-list">
            {automations.length ? (
              automations.map((item) => {
                const details = decodeAutomation(item);
                return (
                  <button
                    className={`flow-library-item${testingId === item.id ? " flow-library-item-active" : ""}`}
                    key={item.id}
                    onClick={() => setTestingId(item.id)}
                    type="button"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{channelLabel(item.channel)} · {triggerLabel(details.triggerType, details.keyword || "")}</span>
                    </div>
                    <span className={item.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>{item.status}</span>
                  </button>
                );
              })
            ) : (
              <div className="builder-empty-state">
                <strong>Nenhum fluxo salvo ainda</strong>
                <p className="mini">Configure o primeiro fluxo à esquerda e publique quando estiver pronto.</p>
              </div>
            )}
          </div>
        </section>
      </aside>
    </section>
  );
}
