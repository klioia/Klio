import { automations, landingProof, plans, resultSignals, timeline } from "@/lib/mock-data";

export function FeatureSection() {
  return (
    <section className="section" id="recursos">
      <div className="shell">
        <span className="eyebrow">Recursos principais</span>
        <h2 className="section-title">Tudo que voce precisa para rodar bots e fluxos com clareza.</h2>
        <div className="grid-3" style={{ marginTop: 24 }}>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Bot com memoria operacional</strong>
            <p className="muted">O bot responde com contexto de canal, lead e etapa do fluxo sem perder a continuidade da conversa.</p>
          </article>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Automacoes por evento</strong>
            <p className="muted">Dispare fluxos por comentario, palavra-chave, nova mensagem, reengajamento ou handoff humano.</p>
          </article>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Webhook e monitoramento</strong>
            <p className="muted">Receba eventos da Meta, acompanhe execucoes e controle a fila automatica com visibilidade total.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ResultsSection() {
  return (
    <section className="section" id="impacto">
      <div className="shell">
        <span className="eyebrow">Impacto</span>
        <h2 className="section-title">Menos tempo perdido. Mais resposta. Mais contexto.</h2>
        <div className="grid-3" style={{ marginTop: 24 }}>
          {resultSignals.map((signal) => (
            <article className="card panel result-card" key={signal.label}>
              <span className="mini">{signal.label}</span>
              <div className="result-value">{signal.value}</div>
              <p className="muted" style={{ marginBottom: 0 }}>{signal.detail}</p>
            </article>
          ))}
        </div>
        <div className="chip-row" style={{ marginTop: 18 }}>
          {landingProof.map((item) => (
            <span className="tag tag-warning" key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AutomationSection() {
  return (
    <section className="section" id="automacoes">
      <div className="shell grid-2">
        <div>
          <span className="eyebrow">Automacoes</span>
          <h2 className="section-title">Fluxos simples para capturar, responder e entregar no momento certo.</h2>
          <div className="timeline" style={{ marginTop: 24 }}>
            {timeline.map((item, index) => (
              <div className="timeline-item" key={item}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span className="muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flow-list">
          {automations.map((automation) => (
            <article className="card panel" key={automation.id}>
              <div className="flow-item">
                <div>
                  <strong>{automation.name}</strong>
                  <div className="mini">{automation.trigger}</div>
                </div>
                <span className={automation.status === "Ativa" ? "tag tag-success" : "tag tag-warning"}>
                  {automation.status}
                </span>
              </div>
              <div className="chip-row" style={{ marginTop: 14 }}>
                {automation.actions.map((action) => (
                  <span className="tag tag-warning" key={action}>
                    {action}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="section" id="planos">
      <div className="shell">
        <span className="eyebrow">Planos Klio</span>
        <h2 className="section-title">Precos claros logo no inicio para voce decidir sem perder tempo.</h2>
        <p className="muted pricing-intro">Escolha pelo nivel da sua operacao. O `Scale` continua sendo o melhor ponto de equilibrio.</p>
        <div className="pricing-grid" style={{ marginTop: 24 }}>
          {plans.map((plan) => (
            <article className={`card panel pricing-card${plan.highlight ? " pricing-card-featured" : ""}`} key={plan.id}>
              <div className="pricing-card-top">
                <div>
                  <div className="pricing-card-name">{plan.name}</div>
                  <div className="mini">{plan.audience}</div>
                </div>
                <span className={`pricing-badge${plan.highlight ? " pricing-badge-featured" : ""}`}>{plan.badge}</span>
              </div>
              <div className="pricing-card-headline">{plan.description}</div>
              <div className="price" style={{ fontSize: 40, marginTop: 18 }}>{plan.price}</div>
              <p className="mini">{plan.billing}</p>
              <div className="divider" />
              <div className="feature-list">
                {plan.features.slice(0, 3).map((feature) => (
                  <div className="pricing-feature" key={feature}>
                    <span className="pricing-feature-dot" />
                    <strong>{feature}</strong>
                  </div>
                ))}
              </div>
              {plan.limitations.length ? <p className="mini pricing-note">{plan.limitations[0]}</p> : null}
              <div className="cta-row" style={{ marginTop: 18 }}>
                {plan.checkoutEnabled ? (
                  <a className={plan.highlight ? "btn btn-primary" : "btn btn-secondary"} href="/register">
                    {plan.highlight ? "Entrar no Scale" : `Escolher ${plan.name}`}
                  </a>
                ) : (
                  <a className="btn btn-secondary" href="/register">
                    {plan.ctaLabel}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="section">
      <div className="shell">
        <section className="card panel final-cta">
          <span className="eyebrow">Pronto para operar</span>
          <h2 className="section-title">Coloque sua automacao conversacional no ar com a Klio.</h2>
          <p className="muted final-cta-copy">
            Entre com seus canais, conecte webhooks, ligue o bot e transforme atendimento em um sistema mais rapido,
            previsivel e escalavel.
          </p>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="/register">
              Criar minha operacao
            </a>
            <a className="btn btn-secondary" href="/login">
              Entrar no painel
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
