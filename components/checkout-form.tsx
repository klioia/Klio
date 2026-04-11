"use client";

import { FormEvent, useMemo, useState } from "react";

type CheckoutPlan = {
  id: string;
  name: string;
  monthlyPrice: number | null;
  price: string;
  billing: string;
  audience: string;
  description: string;
  checkoutEnabled: boolean;
  ctaLabel: string;
  features: string[];
  limitations: string[];
};

type CheckoutCharge = {
  id: string;
  status: string;
  provider: string;
  amount: number;
  qrCodeText: string;
  copyPasteCode: string;
};

type CheckoutFormProps = {
  plan: CheckoutPlan;
};

const WHATSAPP_CONTACT_LINK = "https://wa.me/5511999999999?text=Quero%20falar%20sobre%20o%20plano%20Enterprise%20da%20Klio";

export function CheckoutForm({ plan }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerExternalId, setCustomerExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [charge, setCharge] = useState<CheckoutCharge | null>(null);

  const checkoutAmount = useMemo(() => {
    if (!plan.monthlyPrice) {
      return 0;
    }

    return Number(plan.monthlyPrice.toFixed(2));
  }, [plan.monthlyPrice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/checkout/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerExternalId,
          amount: checkoutAmount,
          description: `Assinatura Klio ${plan.name}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível gerar seu Pix agora.");
      }

      setCharge(data.charge);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao gerar checkout.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyPixCode() {
    if (!charge?.copyPasteCode) {
      return;
    }

    await navigator.clipboard.writeText(charge.copyPasteCode);
    setCopied(true);
  }

  if (!plan.checkoutEnabled) {
    return (
      <section className="card panel checkout-contact-card">
        <span className="eyebrow">Venda consultiva</span>
        <h2 className="section-title" style={{ maxWidth: "14ch" }}>
          Enterprise entra com diagnostico e proposta sob medida.
        </h2>
        <p className="muted">
          Para operações maiores, a Klio fecha melhor quando a gente entende volume, equipe, CRM e regras da operação.
        </p>
        <div className="flow-list" style={{ marginTop: 20 }}>
          <div className="price-row">
            <span className="muted">Escopo</span>
            <strong>Automacoes ilimitadas + infraestrutura dedicada</strong>
          </div>
          <div className="price-row">
            <span className="muted">Processo</span>
            <strong>Diagnostico, proposta, onboarding e SLA</strong>
          </div>
        </div>
        <div className="cta-row" style={{ marginTop: 20 }}>
          <a className="btn btn-primary" href={WHATSAPP_CONTACT_LINK} target="_blank" rel="noreferrer">
            Falar com vendas
          </a>
          <a className="btn btn-secondary" href="/#planos">
            Voltar aos planos
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="checkout-grid">
      <section>
        <span className="eyebrow">Checkout Pix</span>
        <h1 className="section-title">Assine a Klio com um checkout mais claro e pronto para converter.</h1>
        <p className="muted">{plan.description}</p>

        <div className="card panel" style={{ marginTop: 24 }}>
          <div className="flow-item">
            <div>
              <strong>Klio {plan.name}</strong>
              <div className="mini">{plan.audience}</div>
            </div>
            <span className={plan.id === "scale" ? "tag tag-success" : "tag tag-warning"}>{plan.billing}</span>
          </div>
          <div className="price" style={{ fontSize: 42, marginTop: 18 }}>
            {plan.price}
          </div>
          <p className="mini">Pagamento via Pix com geracao imediata.</p>
          <div className="divider" />
          <div className="feature-list">
            {plan.features.slice(0, 5).map((feature) => (
              <div className="feature-item" key={feature}>
                <strong>{feature}</strong>
              </div>
            ))}
          </div>
          {plan.limitations.length ? (
            <>
              <div className="divider" />
              <div className="feature-list">
                {plan.limitations.map((limitation) => (
                  <div className="feature-item" key={limitation}>
                    <span className="mini">{limitation}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <aside className="flow-list">
        <section className="card panel pix-box">
          <strong>Seu Pix</strong>
          <p className="muted">
            Gere o pagamento e copie o código Pix. Quando você integrar um provider real, esse bloco já fica pronto para produção.
          </p>
          <div className="qr" style={{ marginTop: 18 }}>
            {charge?.copyPasteCode ? (
              <div className="qr-copy">
                <strong>{charge.provider === "mock" ? "PIX DEMO" : "PIX GERADO"}</strong>
                <span className="mini">{charge.status}</span>
              </div>
            ) : (
              <strong>QR CODE PIX</strong>
            )}
          </div>
          <label style={{ display: "block", marginTop: 18 }}>
            <span className="mini">Código Pix copia e cola</span>
            <textarea className="textarea" readOnly value={charge?.copyPasteCode || ""} placeholder="Seu código Pix vai aparecer aqui." />
          </label>
          <div className="cta-row" style={{ marginTop: 18 }}>
            <button className="btn btn-primary" type="button" disabled={!charge?.copyPasteCode} onClick={handleCopyPixCode}>
              {copied ? "Código copiado" : "Copiar código"}
            </button>
            <a className="btn btn-secondary" href="/login">
              Ja sou cliente
            </a>
          </div>
          {charge ? (
            <p className="mini" style={{ marginTop: 14 }}>
              Cobranca {charge.id} gerada via {charge.provider} no valor de R$ {charge.amount.toFixed(2).replace(".", ",")}.
            </p>
          ) : null}
        </section>

        <section className="card panel">
          <strong>Dados do comprador</strong>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginTop: 18 }}>
              <span className="mini">Nome</span>
              <input className="input" placeholder="Seu nome completo" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
            </label>
            <label style={{ display: "block", marginTop: 18 }}>
              <span className="mini">Email</span>
              <input className="input" type="email" placeholder="voce@empresa.com" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} required />
            </label>
            <label style={{ display: "block", marginTop: 18 }}>
              <span className="mini">ID do cliente no provider (opcional)</span>
              <input className="input" placeholder="Ex.: cus_123 ou asaas_abc" value={customerExternalId} onChange={(event) => setCustomerExternalId(event.target.value)} />
            </label>
            {error ? (
              <p className="mini" style={{ color: "#ff9cab", marginTop: 16 }}>
                {error}
              </p>
            ) : null}
            <div className="cta-row" style={{ marginTop: 18 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Gerando Pix..." : `Gerar Pix de ${plan.name}`}
              </button>
              <a className="btn btn-secondary" href="/#planos">
                Ver outros planos
              </a>
            </div>
          </form>
        </section>
      </aside>
    </div>
  );
}
