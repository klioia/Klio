export function Hero() {
  return (
    <section className="section">
      <div className="shell hero-grid">
        <div>
          <span className="eyebrow">Chatbot, fluxos e webhooks em um unico motor</span>
          <h1 className="hero-title">Bots e automacoes para WhatsApp e Instagram.</h1>
          <p className="muted">
            Receba eventos, responda com bot e entregue para o humano certo quando fizer sentido.
          </p>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="#planos">
              Ver planos
            </a>
            <a className="btn btn-primary" href="/register">
              Comecar agora
            </a>
            <a className="btn btn-secondary" href="/dashboard">
              Ver painel
            </a>
          </div>
          <div className="hero-proof-row" style={{ marginTop: 18 }}>
            <span className="mini">Planos a partir de R$ 259,90/mes</span>
            <span className="mini">WhatsApp + Instagram</span>
            <span className="mini">Webhook + bot + handoff</span>
          </div>
        </div>
        <div className="hero-clean">
          <div className="card panel hero-surface hero-workspace">
            <div className="hero-workspace-head">
              <div>
                <strong>Klio Flow Engine</strong>
                <div className="mini">builder conversacional com eventos e handoff</div>
              </div>
              <span className="pricing-badge pricing-badge-featured">online</span>
            </div>
            <div className="hero-node-grid">
              <article className="hero-node hero-node-entry">
                <span className="mini">Entrada</span>
                <strong>Webhook Instagram</strong>
                <p className="mini">Comentario identificado em tempo real.</p>
              </article>
              <article className="hero-node">
                <span className="mini">Bot</span>
                <strong>Resposta automatica</strong>
                <p className="mini">Qualifica e conduz a conversa.</p>
              </article>
              <article className="hero-node hero-node-highlight hero-node-wide">
                <span className="mini">Handoff</span>
                <strong>Time comercial</strong>
                <p className="mini">Recebe contexto antes de assumir.</p>
              </article>
            </div>
          </div>
          <div className="hero-note hero-note-premium">
            <strong>Pronta para operar</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Configure canais, ative fluxos e coloque sua automacao no ar sem uma interface poluida.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
