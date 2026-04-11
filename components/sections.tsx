import {
  closingBenefits,
  demoSteps,
  painPoints,
  plans,
  proofMetrics,
  socialProof,
  solutionPoints
} from "@/lib/mock-data";

export function ProblemSolutionSection() {
  return (
    <section className="section">
      <div className="shell grid-2">
        <div>
          <span className="eyebrow">O problema</span>
          <h2 className="section-title">Quando o atendimento demora, a venda esfria.</h2>
          <div className="flow-list" style={{ marginTop: 24 }}>
            {painPoints.map((item) => (
              <article className="card panel feature-item" key={item.title}>
                <strong>{item.title}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">A solucao</span>
          <h2 className="section-title">A Klio responde, organiza e acelera cada conversa.</h2>
          <div className="flow-list" style={{ marginTop: 24 }}>
            {solutionPoints.map((item) => (
              <article className="card panel feature-item solution-item" key={item.title}>
                <strong>{item.title}</strong>
                <p className="muted" style={{ marginBottom: 0 }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DemoSection() {
  return (
    <section className="section" id="demo">
      <div className="shell">
        <span className="eyebrow">Como funciona</span>
        <h2 className="section-title">Sua automacao rodando em poucos passos.</h2>
        <p className="muted pricing-intro">
          A Klio foi feita para simplificar o atendimento: responder na hora, qualificar melhor e levar cada lead
          para o proximo passo sem deixar a operacao pesada.
        </p>
        <div className="grid-2 demo-grid" style={{ marginTop: 24 }}>
          <div className="flow-list">
            {demoSteps.map((step) => (
              <article className="card panel demo-step-card" key={step.step}>
                <div className="flow-item">
                  <strong>{step.step}</strong>
                  <span className="pricing-badge">{step.badge}</span>
                </div>
                <h3 className="demo-step-title">{step.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{step.description}</p>
              </article>
            ))}
          </div>
          <div className="card panel demo-visual-card">
            <div className="demo-visual-track">
              <div className="demo-visual-bubble demo-visual-bubble-in">
                <span className="mini">Mensagem recebida</span>
                <strong>Quero saber como funciona.</strong>
              </div>
              <div className="demo-visual-arrow">{`->`}</div>
              <div className="demo-visual-bubble demo-visual-bubble-out">
                <span className="mini">Resposta da Klio</span>
                <strong>Consigo te orientar agora e entender sua necessidade.</strong>
              </div>
              <div className="demo-visual-arrow">{`->`}</div>
              <div className="demo-visual-bubble">
                <span className="mini">Lead organizado</span>
                <strong>Contato qualificado e pronto para avancar.</strong>
              </div>
              <div className="demo-visual-arrow">{`->`}</div>
              <div className="demo-visual-bubble demo-visual-bubble-highlight">
                <span className="mini">Equipe assume</span>
                <strong>Seu time entra com contexto e foco em fechar.</strong>
              </div>
            </div>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/register">
                Testar automacao
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialProofSection() {
  return (
    <section className="section" id="impacto">
      <div className="shell">
        <span className="eyebrow">Prova social</span>
        <h2 className="section-title">Resultados que fazem a operacao crescer sem travar.</h2>
        <div className="grid-3" style={{ marginTop: 24 }}>
          {proofMetrics.map((metric) => (
            <article className="card panel result-card" key={metric.label}>
              <span className="mini">{metric.label}</span>
              <div className="result-value">{metric.value}</div>
              <p className="muted" style={{ marginBottom: 0 }}>{metric.detail}</p>
            </article>
          ))}
        </div>
        <div className="grid-3 testimonial-grid" style={{ marginTop: 24 }}>
          {socialProof.map((item) => (
            <article className="card panel testimonial-card" key={item.name}>
              <p className="testimonial-quote">“{item.quote}”</p>
              <div className="mini">
                <strong>{item.name}</strong> - {item.role}
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
        <h2 className="section-title">Escolha hoje o plano certo para parar de perder atendimento.</h2>
        <p className="muted pricing-intro">
          Se sua operacao continua manual, sua equipe trabalha mais e vende menos. A Klio ajuda voce a escalar sem
          transformar o atendimento em caos.
        </p>
        <div className="pricing-grid" style={{ marginTop: 24 }}>
          {plans.map((plan) => (
            <article className={`card panel pricing-card${plan.highlight ? " pricing-card-featured" : ""}`} key={plan.id}>
              <div className="pricing-card-top">
                <div>
                  <div className="pricing-card-name">{plan.name}</div>
                  <div className="mini">{plan.audience}</div>
                </div>
                <div className="pricing-badge-stack">
                  <span className={`pricing-badge${plan.highlight ? " pricing-badge-featured" : ""}`}>{plan.badge}</span>
                  {plan.supportingBadge ? <span className="pricing-badge">{plan.supportingBadge}</span> : null}
                </div>
              </div>
              <div className="pricing-card-headline">{plan.description}</div>
              <div className="price" style={{ fontSize: 40, marginTop: 18 }}>{plan.price}</div>
              <p className="mini">{plan.billing}</p>
              <div className="divider" />
              <div className="feature-list">
                {plan.features.slice(0, 4).map((feature) => (
                  <div className="pricing-feature" key={feature}>
                    <span className="pricing-feature-dot" />
                    <strong>{feature}</strong>
                  </div>
                ))}
              </div>
              {plan.urgencyLine ? <p className="pricing-note">{plan.urgencyLine}</p> : null}
              <div className="cta-row" style={{ marginTop: 18 }}>
                <a className={plan.highlight ? "btn btn-primary" : "btn btn-secondary"} href="/register">
                  {plan.ctaLabel}
                </a>
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
          <span className="eyebrow">Fechamento</span>
          <h2 className="section-title">Seu atendimento pode continuar pesado ou comecar a vender no automatico.</h2>
          <p className="muted final-cta-copy">
            A Klio foi criada para responder mais rapido, aproveitar mais leads e ajudar seu negocio a crescer com
            menos operacao manual. Quanto antes voce automatiza, antes sua equipe ganha tempo para vender.
          </p>
          <div className="chip-row" style={{ marginTop: 18 }}>
            {closingBenefits.map((item) => (
              <span className="tag tag-warning" key={item}>{item}</span>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="/register">
              Comecar agora sem equipe
            </a>
            <a className="btn btn-secondary" href="#demo">
              Ver a plataforma em acao
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
