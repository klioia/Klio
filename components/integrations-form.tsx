"use client";

import { FormEvent, useMemo, useState } from "react";

type IntegrationState = {
  whatsapp: {
    connected: boolean;
    label: string;
    phoneNumberId: string;
    accessToken?: string;
    verifyToken?: string;
  };
  instagram: {
    connected: boolean;
    label: string;
    appId: string;
    accessToken?: string;
    verifyToken?: string;
  };
  pix: {
    connected: boolean;
    label: string;
    provider: string;
    accessToken?: string;
  };
};

type IntegrationsFormProps = {
  appUrl: string;
  initialState: IntegrationState;
};

export function IntegrationsForm({ appUrl, initialState }: IntegrationsFormProps) {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState("");
  const [testRecipient, setTestRecipient] = useState("");
  const [testMessage, setTestMessage] = useState("Oi, esta é uma mensagem de teste da Klio.");
  const [showSecrets, setShowSecrets] = useState(false);
  const [activeAction, setActiveAction] = useState("");

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copiado.`);
    } catch {
      setStatus(`Não foi possível copiar ${label.toLowerCase()}.`);
    }
  }

  async function runAction(actionKey: string, callback: () => Promise<void>) {
    setActiveAction(actionKey);
    try {
      await callback();
    } finally {
      setActiveAction("");
    }
  }

  async function save(channel: "whatsapp" | "instagram" | "pix") {
    await runAction(`save-${channel}`, async () => {
      setStatus("Salvando integração...");

      const values =
        channel === "whatsapp"
          ? {
              phoneNumberId: state.whatsapp.phoneNumberId,
              accessToken: state.whatsapp.accessToken || "",
              verifyToken: state.whatsapp.verifyToken || ""
            }
          : channel === "instagram"
            ? {
                appId: state.instagram.appId,
                accessToken: state.instagram.accessToken || "",
                verifyToken: state.instagram.verifyToken || ""
              }
            : {
                provider: state.pix.provider,
                accessToken: state.pix.accessToken || ""
              };

      const response = await fetch("/api/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, values })
      });

      const data = await response.json();
      setStatus(response.ok ? "Integração salva com sucesso." : data.error || "Falha ao salvar.");
    });
  }

  async function test(channel: "whatsapp" | "instagram") {
    await runAction(`test-${channel}`, async () => {
      setStatus(`Testando ${channel === "whatsapp" ? "WhatsApp" : "Instagram"}...`);

      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel })
      });

      const data = await response.json();
      setStatus(response.ok ? "Conexão validada com sucesso." : data.error || "Falha no teste.");
    });
  }

  async function sendTestMessage(channel: "whatsapp" | "instagram") {
    if (!testRecipient.trim()) {
      setStatus("Informe o destinatário para testar o envio.");
      return;
    }

    await runAction(`send-${channel}`, async () => {
      setStatus(`Enviando teste em ${channel === "whatsapp" ? "WhatsApp" : "Instagram"}...`);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          recipient: testRecipient,
          message: testMessage
        })
      });

      const data = await response.json();
      setStatus(response.ok ? "Mensagem de teste enviada." : data.error || "Falha no envio.");
    });
  }

  function submitHandler(event: FormEvent) {
    event.preventDefault();
  }

  const webhookUrl = `${appUrl}/api/meta/webhook`;
  const whatsappReady = Boolean(state.whatsapp.phoneNumberId && state.whatsapp.accessToken && state.whatsapp.verifyToken);
  const instagramReady = Boolean(state.instagram.appId && state.instagram.accessToken && state.instagram.verifyToken);
  const setupCount = [whatsappReady, instagramReady].filter(Boolean).length;
  const setupSummary = useMemo(
    () => [
      { label: "Webhook", value: "Pronto" },
      { label: "WhatsApp", value: whatsappReady ? "Configurado" : "Pendente" },
      { label: "Instagram", value: instagramReady ? "Configurado" : "Pendente" }
    ],
    [instagramReady, whatsappReady]
  );

  return (
    <form onSubmit={submitHandler} className="flow-list">
      <section className="card panel">
        <div className="builder-section-header">
          <div>
            <strong>Integrações principais</strong>
            <p className="mini" style={{ marginTop: 8 }}>
              Configure os canais, copie os dados da Meta e valide tudo pela Klio.
            </p>
          </div>
          <span className="pricing-badge pricing-badge-featured">{setupCount}/2 prontas</span>
        </div>

        <div className="integration-overview-grid" style={{ marginTop: 18 }}>
          {setupSummary.map((item) => (
            <div className="builder-summary-card" key={item.label}>
              <span className="mini">{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card panel">
        <div className="flow-item">
          <strong>Dados para copiar</strong>
          <span className="tag tag-success">setup rápido</span>
        </div>

        <div className="integration-copy-grid" style={{ marginTop: 18 }}>
          <div className="integration-copy-card">
            <span className="mini">Webhook URL</span>
            <strong>{webhookUrl}</strong>
            <button className="btn btn-secondary" onClick={() => copyValue(webhookUrl, "Webhook URL")} type="button">
              Copiar webhook
            </button>
          </div>
          <div className="integration-copy-card">
            <span className="mini">Verify token do WhatsApp</span>
            <strong>{state.whatsapp.verifyToken || "Defina e salve abaixo"}</strong>
            <button
              className="btn btn-secondary"
              onClick={() => copyValue(state.whatsapp.verifyToken || "", "Verify token do WhatsApp")}
              type="button"
            >
              Copiar token
            </button>
          </div>
          <div className="integration-copy-card">
            <span className="mini">Verify token do Instagram</span>
            <strong>{state.instagram.verifyToken || "Defina e salve abaixo"}</strong>
            <button
              className="btn btn-secondary"
              onClick={() => copyValue(state.instagram.verifyToken || "", "Verify token do Instagram")}
              type="button"
            >
              Copiar token
            </button>
          </div>
        </div>
      </section>

      <section className="card panel">
        <div className="flow-item">
          <strong>Segurança</strong>
          <button className="btn btn-secondary" onClick={() => setShowSecrets((value) => !value)} type="button">
            {showSecrets ? "Ocultar dados sensíveis" : "Mostrar dados sensíveis"}
          </button>
        </div>
      </section>

      <div className="integration-card-grid">
        <section className="card panel">
          <div className="flow-item">
            <div>
              <strong>WhatsApp Business</strong>
              <div className="mini">Canal principal de atendimento e repasse</div>
            </div>
            <span className={state.whatsapp.connected ? "tag tag-success" : "tag tag-warning"}>
              {state.whatsapp.connected ? "Conectado" : "Pendente"}
            </span>
          </div>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Phone Number ID</span>
            <input
              className="input"
              value={state.whatsapp.phoneNumberId}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  whatsapp: { ...current.whatsapp, phoneNumberId: event.target.value }
                }))
              }
            />
          </label>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Access token</span>
            <input
              className="input"
              type={showSecrets ? "text" : "password"}
              value={state.whatsapp.accessToken || ""}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  whatsapp: { ...current.whatsapp, accessToken: event.target.value }
                }))
              }
            />
          </label>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Verify token</span>
            <input
              className="input"
              type={showSecrets ? "text" : "password"}
              value={state.whatsapp.verifyToken || ""}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  whatsapp: { ...current.whatsapp, verifyToken: event.target.value }
                }))
              }
            />
          </label>
          <div className="cta-row" style={{ marginTop: 18 }}>
            <button className="btn btn-primary" onClick={() => save("whatsapp")} type="button">
              {activeAction === "save-whatsapp" ? "Salvando..." : "Salvar WhatsApp"}
            </button>
            <button className="btn btn-secondary" onClick={() => test("whatsapp")} type="button">
              {activeAction === "test-whatsapp" ? "Testando..." : "Testar conexão"}
            </button>
            <button className="btn btn-secondary" onClick={() => sendTestMessage("whatsapp")} type="button">
              {activeAction === "send-whatsapp" ? "Enviando..." : "Enviar teste"}
            </button>
          </div>
        </section>

        <section className="card panel">
          <div className="flow-item">
            <div>
              <strong>Instagram Messaging</strong>
              <div className="mini">Responda comentários e DMs pelo mesmo painel</div>
            </div>
            <span className={state.instagram.connected ? "tag tag-success" : "tag tag-warning"}>
              {state.instagram.connected ? "Conectado" : "Pendente"}
            </span>
          </div>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">App ID</span>
            <input
              className="input"
              value={state.instagram.appId}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  instagram: { ...current.instagram, appId: event.target.value }
                }))
              }
            />
          </label>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Access token</span>
            <input
              className="input"
              type={showSecrets ? "text" : "password"}
              value={state.instagram.accessToken || ""}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  instagram: { ...current.instagram, accessToken: event.target.value }
                }))
              }
            />
          </label>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Verify token</span>
            <input
              className="input"
              type={showSecrets ? "text" : "password"}
              value={state.instagram.verifyToken || ""}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  instagram: { ...current.instagram, verifyToken: event.target.value }
                }))
              }
            />
          </label>
          <div className="cta-row" style={{ marginTop: 18 }}>
            <button className="btn btn-primary" onClick={() => save("instagram")} type="button">
              {activeAction === "save-instagram" ? "Salvando..." : "Salvar Instagram"}
            </button>
            <button className="btn btn-secondary" onClick={() => test("instagram")} type="button">
              {activeAction === "test-instagram" ? "Testando..." : "Testar conexão"}
            </button>
            <button className="btn btn-secondary" onClick={() => sendTestMessage("instagram")} type="button">
              {activeAction === "send-instagram" ? "Enviando..." : "Enviar teste"}
            </button>
          </div>
        </section>
      </div>

      <section className="card panel">
        <div className="flow-item">
          <strong>Mensagem de teste</strong>
          <span className="tag tag-warning">uso interno</span>
        </div>
        <div className="grid-2" style={{ marginTop: 18 }}>
          <label>
            <span className="mini">Destinatário</span>
            <input
              className="input"
              placeholder="WhatsApp: 5511999999999 ou recipient id do Instagram"
              value={testRecipient}
              onChange={(event) => setTestRecipient(event.target.value)}
            />
          </label>
          <label>
            <span className="mini">Texto do teste</span>
            <textarea className="textarea" value={testMessage} onChange={(event) => setTestMessage(event.target.value)} />
          </label>
        </div>
      </section>

      {status ? <p className="mini">{status}</p> : null}
    </form>
  );
}
