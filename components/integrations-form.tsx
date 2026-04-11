"use client";

import { FormEvent, useState } from "react";

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

  async function save(channel: "whatsapp" | "instagram" | "pix") {
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
  }

  async function test(channel: "whatsapp" | "instagram") {
    setStatus(`Testando ${channel === "whatsapp" ? "WhatsApp" : "Instagram"}...`);

    const response = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel })
    });

    const data = await response.json();
    setStatus(response.ok ? "Conexão validada com sucesso." : data.error || "Falha no teste.");
  }

  async function sendTestMessage(channel: "whatsapp" | "instagram") {
    if (!testRecipient.trim()) {
      setStatus("Informe o destinatário para testar o envio.");
      return;
    }

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
  }

  function submitHandler(event: FormEvent) {
    event.preventDefault();
  }

  const webhookUrl = `${appUrl}/api/meta/webhook`;
  const whatsappReady = Boolean(state.whatsapp.phoneNumberId && state.whatsapp.accessToken && state.whatsapp.verifyToken);
  const instagramReady = Boolean(state.instagram.appId && state.instagram.accessToken && state.instagram.verifyToken);

  return (
    <form onSubmit={submitHandler} className="flow-list">
      <section className="card panel">
        <div className="builder-section-header">
          <div>
            <strong>Onboarding da Meta</strong>
            <p className="mini" style={{ marginTop: 8 }}>
              Use este bloco para configurar os canais, copiar o callback e validar o envio sem sair da Klio.
            </p>
          </div>
          <span className="pricing-badge pricing-badge-featured">setup</span>
        </div>

        <div className="integration-setup-grid">
          <div className="onboarding-box">
            <strong>1. Abra seu app na Meta</strong>
            <p className="mini">Ative WhatsApp Business Platform e Instagram Messaging.</p>
          </div>
          <div className="onboarding-box">
            <strong>2. Configure o callback</strong>
            <p className="mini">Cadastre a URL da Klio como callback principal.</p>
          </div>
          <div className="onboarding-box">
            <strong>3. Cole seus tokens</strong>
            <p className="mini">Preencha IDs, tokens e verify token em cada canal.</p>
          </div>
          <div className="onboarding-box">
            <strong>4. Teste antes de ativar</strong>
            <p className="mini">Valide conexão e envio antes de publicar fluxos.</p>
          </div>
        </div>
      </section>

      <section className="card panel">
        <div className="flow-item">
          <strong>Dados para copiar</strong>
          <span className="tag tag-success">Klio setup</span>
        </div>

        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Webhook URL</span>
          <input className="input" readOnly value={webhookUrl} />
        </label>

        <div className="grid-2" style={{ marginTop: 18 }}>
          <label>
            <span className="mini">Verify token do WhatsApp</span>
            <input className="input" readOnly value={state.whatsapp.verifyToken || "Defina e salve abaixo"} />
          </label>
          <label>
            <span className="mini">Verify token do Instagram</span>
            <input className="input" readOnly value={state.instagram.verifyToken || "Defina e salve abaixo"} />
          </label>
        </div>

        <div className="checklist" style={{ marginTop: 18 }}>
          <div className="check-item">
            <span className={whatsappReady ? "tag tag-success" : "tag tag-warning"}>{whatsappReady ? "OK" : "Pendente"}</span>
            <span className="mini">WhatsApp com ID, token e verify token preenchidos</span>
          </div>
          <div className="check-item">
            <span className={instagramReady ? "tag tag-success" : "tag tag-warning"}>{instagramReady ? "OK" : "Pendente"}</span>
            <span className="mini">Instagram com App ID, token e verify token preenchidos</span>
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
            <strong>WhatsApp Business</strong>
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
              Salvar WhatsApp
            </button>
            <button className="btn btn-secondary" onClick={() => test("whatsapp")} type="button">
              Testar conexão
            </button>
            <button className="btn btn-secondary" onClick={() => sendTestMessage("whatsapp")} type="button">
              Enviar teste
            </button>
          </div>
        </section>

        <section className="card panel">
          <div className="flow-item">
            <strong>Instagram Messaging</strong>
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
              Salvar Instagram
            </button>
            <button className="btn btn-secondary" onClick={() => test("instagram")} type="button">
              Testar conexão
            </button>
            <button className="btn btn-secondary" onClick={() => sendTestMessage("instagram")} type="button">
              Enviar teste
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

