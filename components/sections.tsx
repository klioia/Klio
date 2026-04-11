import { automations, landingProof, plans, resultSignals, timeline } from "@/lib/mock-data";
import { LandingReveal } from "@/components/landing-reveal";

export function FeatureSection() {
  return (
    <section className="section" id="recursos">
      <div className="shell">
        <LandingReveal>
          <span className="eyebrow">Recursos principais</span>
          <h2 className="section-title">Uma operação mais inteligente, sem excesso de tela e sem excesso de equipe.</h2>
        </LandingReveal>

        <div className="feature-asymmetric-grid" style={{ marginTop: 28 }}>
          {landingProof.map((item, index) => (
            <LandingReveal delay={index * 0.08} key={item.title}>
              <article className={`feature-glow-card feature-glow-card-${index + 1}`}>
                <span className="feature-icon" />
                <strong>{item.title}</strong>
                <p className="muted">{item.description}</p>
              </article>
            </LandingReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AutomationSection() {
  return (
    <section className="section" id="automacoes">
      <div className="shell automation-section">
        <LandingReveal>
          <div>
            <span className="eyebrow">Como funciona</span>
            <h2 className="section-title">A Klio responde, organiza e entrega o contato na hora certa.</h2>
          </div>
        </LandingReveal>

        <div className="automation-showcase" style={{ marginTop: 28 }}>
          <LandingReveal>
            <div className="timeline-clean">
              {timeline.map((item, index) => (
                <div className="timeline-clean-item" key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="mini">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </LandingReveal>

          <LandingReveal delay={0.1}>
            <div className="automation-stack">
              {automations.map((automation) => (
                <article className="automation-showcase-card" key={automation.id}>
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
          </LandingReveal>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="section" id="planos">
      <div className="shell">
        <LandingReveal>
          <span className="eyebrow">Planos Klio</span>
          <h2 className="section-title">Comece pequeno. Escale com uma operação muito mais forte.</h2>
          <p className="muted pricing-intro">Escolha o ritmo ideal para o seu momento e evolua sem trocar de plataforma.</p>
        </LandingReveal>

        <div className="pricing-grid" style={{ marginTop: 24 }}>
          {plans.map((plan, index) => (
            <LandingReveal delay={index * 0.06} key={plan.id}>
              <article className={`card panel pricing-card${plan.highlight ? " pricing-card-featured pricing-card-glow" : ""}`}>
                <div className="pricing-card-top">
                  <div>
                    <div className="pricing-card-name">{plan.name}</div>
                    <div className="mini">{plan.audience}</div>
                  </div>
                  <span className={`pricing-badge${plan.highlight ? " pricing-badge-featured" : ""}`}>
                    {plan.highlight ? "Mais popular" : plan.badge}
                  </span>
                </div>
                <div className="pricing-card-headline">{plan.description}</div>
                <div className="price" style={{ fontSize: 40, marginTop: 18 }}>
                  {plan.price}
                </div>
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
                  <a className={plan.highlight ? "btn btn-primary" : "btn btn-secondary"} href="/register">
                    {plan.highlight ? "Começar no Scale" : plan.ctaLabel}
                  </a>
                </div>
              </article>
            </LandingReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResultsSection() {
  return (
    <section className="section" id="impacto">
      <div className="shell">
        <LandingReveal>
          <span className="eyebrow">Impacto</span>
          <h2 className="section-title">Mais velocidade na resposta. Mais controle para escalar.</h2>
        </LandingReveal>

        <div className="grid-3" style={{ marginTop: 24 }}>
          {resultSignals.map((signal, index) => (
            <LandingReveal delay={index * 0.08} key={signal.label}>
              <article className="card panel result-card">
                <span className="mini">{signal.label}</span>
                <div className="result-value">{signal.value}</div>
                <p className="muted" style={{ marginBottom: 0 }}>
                  {signal.detail}
                </p>
              </article>
            </LandingReveal>
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
        <LandingReveal>
          <section className="card panel final-cta">
            <span className="eyebrow">Pronta para crescer</span>
            <h2 className="section-title">Automatize o atendimento agora e cresça sem aumentar a operação no mesmo ritmo.</h2>
            <p className="muted final-cta-copy">
              A Klio foi feita para equipes que querem vender mais, responder mais rápido e manter tudo organizado mesmo com o volume subindo.
            </p>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/register">
                Começar grátis
              </a>
              <a className="btn btn-secondary" href="/login">
                Entrar na Klio
              </a>
            </div>
          </section>
        </LandingReveal>
      </div>
    </section>
  );
}
