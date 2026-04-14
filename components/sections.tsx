"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { automations, features, plans, resultSignals, timeline } from "@/lib/mock-data";
import { LandingReveal } from "@/components/landing-reveal";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  suffixAfterSpace?: string;
};

function Counter({ value, prefix = "", suffix = "", suffixAfterSpace = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [current, setCurrent] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const duration = 1200;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(value * eased));
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {current}
      {suffix}
      {suffixAfterSpace ? <span className="result-unit">/{suffixAfterSpace}</span> : null}
    </span>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value);
}

export function FeatureSection() {
  return (
    <section className="section" id="recursos">
      <div className="shell">
        <LandingReveal>
          <span className="eyebrow">Recursos principais</span>
          <h2 className="section-title">Tudo o que você precisa para operar sem ruído.</h2>
        </LandingReveal>

        <div className="feature-grid" style={{ marginTop: 28 }}>
          {features.map((item, index) => (
            <LandingReveal delay={index * 0.06} key={item.title}>
              <article className="feature-card">
                <span className={`feature-icon feature-icon-${index + 1}`} />
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
            <div className="timeline-visual">
              {timeline.map((item, index) => (
                <div className="timeline-step" key={item.title}>
                  <div className="timeline-number">{index + 1}</div>
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
                  <div className="automation-card-head">
                    <div>
                      <div className="automation-title">
                        <span className="automation-icon">{automation.icon}</span>
                        <strong>{automation.name}</strong>
                      </div>
                      <div className="mini">{automation.trigger}</div>
                    </div>
                    <span className={automation.status === "Ativa" ? "status-pill status-pill-success" : "status-pill status-pill-muted"}>
                      {automation.status}
                    </span>
                  </div>
                  <div className="chip-row" style={{ marginTop: 16 }}>
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
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const pricingPlans = useMemo(
    () =>
      plans.map((plan) => {
        if (!plan.monthlyPrice) return plan;
        const annualPrice = plan.monthlyPrice * (1 - plan.annualDiscount);
        return {
          ...plan,
          price: billing === "monthly" ? `${formatPrice(plan.monthlyPrice)}/mês` : `${formatPrice(annualPrice)}/mês`,
          billing:
            billing === "monthly"
              ? plan.billingMonthly
              : `${Math.round(plan.annualDiscount * 100)}% OFF anual · ${plan.billingMonthly}`
        };
      }),
    [billing]
  );

  return (
    <section className="section" id="planos">
      <div className="shell">
        <LandingReveal>
          <span className="eyebrow">Planos Klio</span>
          <h2 className="section-title">Comece pequeno. Escale com uma operação muito mais forte.</h2>
          <p className="muted pricing-intro">Escolha o ritmo ideal para o seu momento e evolua sem trocar de plataforma.</p>
        </LandingReveal>

        <div className="pricing-toggle">
          <span className="mini">Mensal</span>
          <button
            className={`toggle${billing === "annual" ? " toggle-active" : ""}`}
            type="button"
            onClick={() => setBilling((state) => (state === "monthly" ? "annual" : "monthly"))}
          >
            <span className="toggle-knob" />
          </button>
          <span className="mini">
            Anual <span className="badge-discount">Economize até 20%</span>
          </span>
        </div>

        <div className="pricing-grid" style={{ marginTop: 24 }}>
          {pricingPlans.map((plan, index) => (
            <LandingReveal delay={index * 0.06} key={plan.id}>
              <article className={`card panel pricing-card${plan.highlight ? " pricing-card-featured pricing-card-glow" : ""}`}>
                <div className="pricing-card-top">
                  <div>
                    <div className="pricing-card-name">{plan.name}</div>
                    <div className="mini">{plan.audience}</div>
                  </div>
                  <div className="pricing-badge-stack">
                    <span className={`pricing-badge${plan.highlight ? " pricing-badge-featured" : ""}`}>
                      {plan.highlight ? "Mais escolhido" : plan.badge}
                    </span>
                    {plan.highlight ? <span className="pricing-badge pricing-badge-muted">Melhor custo-benefício</span> : null}
                  </div>
                </div>
                <div className="pricing-card-headline">{plan.description}</div>
                <div className="price" style={{ fontSize: 40, marginTop: 18 }}>
                  {plan.price}
                </div>
                <p className="mini">{plan.billing}</p>
                <div className="divider" />
                <div className="feature-list">
                  {plan.features.map((feature) => (
                    <div className="pricing-feature" key={feature}>
                      <span className="pricing-feature-dot" />
                      <strong>{feature}</strong>
                    </div>
                  ))}
                </div>
                {plan.freeTrial ? <p className="mini pricing-note">Teste grátis por 7 dias</p> : null}
                <div className="cta-row" style={{ marginTop: 18 }}>
                  {plan.id === "enterprise" ? (
                    <a className="btn btn-secondary" href="#">
                      Falar com vendas
                    </a>
                  ) : (
                    <a className={plan.highlight ? "btn btn-primary" : "btn btn-secondary"} href="/register">
                      {plan.highlight ? "Começar no Scale" : plan.ctaLabel}
                    </a>
                  )}
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

        <div className="grid-4" style={{ marginTop: 24 }}>
          {resultSignals.map((signal, index) => (
            <LandingReveal delay={index * 0.08} key={signal.label}>
              <article className="card panel result-card">
                <span className="result-icon">{signal.icon}</span>
                <span className="mini">{signal.label}</span>
                <div className="result-value">
                  <Counter
                    value={signal.value}
                    prefix={signal.prefix}
                    suffix={signal.suffix}
                    suffixAfterSpace={signal.suffixAfterSpace}
                  />
                </div>
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
            <h2 className="section-title">Automatize o atendimento agora e escale com segurança.</h2>
            <p className="muted final-cta-copy">
              Sem cartão de crédito. Configure em menos de 5 minutos e comece a responder com IA.
            </p>
            <div className="cta-row" style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="/register">
                Automatizar meu atendimento
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
