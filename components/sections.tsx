import { automations, landingProof, plans, resultSignals, timeline } from "@/lib/mock-data";

export function FeatureSection() {
  return (
    <section className="section" id="recursos">
      <div className="shell">
        <span className="eyebrow">Recursos principais</span>
        <h2 className="section-title">Tudo o que você precisa para automatizar o atendimento com clareza.</h2>
        <div className="grid-3" style={{ marginTop: 24 }}>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Bot com contexto</strong>
            <p className="muted">A Klio responde sem perder o histórico e mantém a conversa organizada do começo ao fim.</p>
          </article>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Fluxos automáticos</strong>
            <p className="muted">Ative respostas por palavra-chave, nova mensagem, retomada de contato ou etapa do atendimento.</p>
          </article>
          <article className="card panel feature-item" style={{ display: "block" }}>
            <strong>Painel de operação</strong>
            <p className="muted">Acompanhe execuções, fila de atendimento e status dos canais sem perder visibilidade.</p>
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
        <h2 className="section-title">Menos tempo perdido. Mais respostas. Mais controle.</h2>
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
          <span className="eyebrow">Como funciona</span>
          <h2 className="section-title">Fluxos simples para captar, responder e repassar no momento certo.</h2>
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
        <h2 className="section-title">Preços claros logo no início para você decidir sem perder tempo.</h2>
        <p className="muted pricing-intro">Escolha pelo nível da sua operação. O plano Scale continua sendo o melhor ponto de equilíbrio.</p>
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
                    {plan.highlight ? "Escolher Scale" : `Escolher ${plan.name}`}
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
          <h2 className="section-title">Coloque sua automação conversacional no ar com a Klio.</h2>
          <p className="muted final-cta-copy">
            Conecte seus canais, ative seus fluxos e transforme o atendimento em uma operação mais rápida, previsível
            e escalável.
          </p>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="/register">
              Criar minha operação
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
