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
  const [testMessage, setTestMessage] = useState("Oi, esta e uma mensagem de teste da Klio.");
  const [showSecrets, setShowSecrets] = useState(false);

  async function save(channel: "whatsapp" | "instagram" | "pix") {
    setStatus("Salvando integracao...");

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
    setStatus(response.ok ? "Integracao salva." : data.error || "Falha ao salvar.");
  }

  async function test(channel: "whatsapp" | "instagram") {
    setStatus(`Testando ${channel}...`);

    const response = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel })
    });

    const data = await response.json();
    setStatus(response.ok ? `Conexao ok (${channel}).` : data.error || "Falha no teste.");
  }

  async function sendTestMessage(channel: "whatsapp" | "instagram") {
    if (!testRecipient.trim()) {
      setStatus("Informe o destinatario para testar o envio.");
      return;
    }

    setStatus(`Enviando teste em ${channel}...`);

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
    setStatus(response.ok ? `Mensagem de teste enviada em ${channel}.` : data.error || "Falha no envio.");
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
        <span className="eyebrow">Onboarding Meta</span>
        <h3 style={{ marginBottom: 8 }}>Conecte WhatsApp e Instagram sem se perder</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Use este checklist para configurar seu app na Meta e depois voltar aqui para testar tudo dentro da Klio.
        </p>
        <div className="grid-2" style={{ marginTop: 18 }}>
          <div className="onboarding-box">
            <strong>1. Crie ou abra seu app na Meta</strong>
            <p className="mini">Ative WhatsApp Business Platform e Instagram Messaging no painel da Meta.</p>
          </div>
          <div className="onboarding-box">
            <strong>2. Configure o webhook</strong>
            <p className="mini">Cadastre a URL abaixo como callback principal do app.</p>
          </div>
          <div className="onboarding-box">
            <strong>3. Cole tokens e IDs aqui</strong>
            <p className="mini">Preencha os campos de cada canal e salve na Klio.</p>
          </div>
          <div className="onboarding-box">
            <strong>4. Teste conexao e envio</strong>
            <p className="mini">Valide o canal e envie uma mensagem de teste antes de ativar automacoes.</p>
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
            <span className="mini">Verify Token WhatsApp</span>
            <input
              className="input"
              readOnly
              value={state.whatsapp.verifyToken || "Defina e salve um verify token abaixo"}
            />
          </label>
          <label>
            <span className="mini">Verify Token Instagram</span>
            <input
              className="input"
              readOnly
              value={state.instagram.verifyToken || "Defina e salve um verify token abaixo"}
            />
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
          <strong>Seguranca</strong>
          <button className="btn btn-secondary" onClick={() => setShowSecrets((value) => !value)} type="button">
            {showSecrets ? "Ocultar tokens" : "Mostrar tokens"}
          </button>
        </div>
      </section>

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
          <span className="mini">Access Token</span>
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
          <span className="mini">Verify Token</span>
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
            Testar conexao
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
          <span className="mini">Access Token</span>
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
          <span className="mini">Verify Token</span>
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
            Testar conexao
          </button>
          <button className="btn btn-secondary" onClick={() => sendTestMessage("instagram")} type="button">
            Enviar teste
          </button>
        </div>
      </section>

      <section className="card panel">
        <div className="flow-item">
          <strong>Pix Provider</strong>
          <span className={state.pix.connected ? "tag tag-success" : "tag tag-warning"}>
            {state.pix.connected ? "Conectado" : "Pendente"}
          </span>
        </div>
        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Provider</span>
          <select
            className="select"
            value={state.pix.provider}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                pix: { ...current.pix, provider: event.target.value }
              }))
            }
          >
            <option value="mock">Mock</option>
            <option value="mercado_pago">Mercado Pago</option>
            <option value="asaas">Asaas</option>
          </select>
        </label>
        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Access Token / API Key</span>
          <input
            className="input"
            type={showSecrets ? "text" : "password"}
            value={state.pix.accessToken || ""}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                pix: { ...current.pix, accessToken: event.target.value }
              }))
            }
          />
        </label>
        <div className="cta-row" style={{ marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => save("pix")} type="button">
            Salvar Pix
          </button>
        </div>
      </section>

      <section className="card panel">
        <strong>Mensagem de teste</strong>
        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Destinatario</span>
          <input
            className="input"
            placeholder="WhatsApp: 5511999999999 ou Instagram recipient id"
            value={testRecipient}
            onChange={(event) => setTestRecipient(event.target.value)}
          />
        </label>
        <label style={{ display: "block", marginTop: 18 }}>
          <span className="mini">Texto</span>
          <textarea className="textarea" value={testMessage} onChange={(event) => setTestMessage(event.target.value)} />
        </label>
      </section>

      {status ? <p className="mini">{status}</p> : null}
    </form>
  );
}
