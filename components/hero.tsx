import Grainient from "@/components/Grainient";

export function Hero() {
  return (
    <section className="section hero-section">
      <div className="hero-background" style={{ width: "100%", height: "100%", position: "absolute" }}>
        <Grainient
          color1="#060010"
          color2="#200e62"
          color3="#B19EEF"
          timeSpeed={0.25}
          colorBalance={-0.11}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="hero-overlay" />

      <div className="shell hero-grid hero-content">
        <div>
          <span className="eyebrow">Atendimento automatizado em um só lugar</span>
          <h1 className="hero-title">Automatize conversas e responda mais rápido no WhatsApp e Instagram.</h1>
          <p className="muted">
            A Klio organiza seu atendimento, responde no tempo certo e entrega cada conversa para a pessoa certa sem
            deixar a operação pesada.
          </p>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="#planos">
              Ver planos
            </a>
            <a className="btn btn-secondary" href="/register">
              Criar conta
            </a>
          </div>
          <div className="hero-proof-row" style={{ marginTop: 18 }}>
            <span className="mini">Planos a partir de R$ 259,90/mês</span>
            <span className="mini">WhatsApp + Instagram</span>
            <span className="mini">Fluxos, bot e atendimento organizado</span>
          </div>
        </div>

        <div className="hero-clean">
          <div className="card panel hero-surface hero-workspace">
            <div className="hero-workspace-head">
              <div>
                <strong>Klio Flow Engine</strong>
                <div className="mini">painel conversacional para automações e repasse de atendimento</div>
              </div>
              <span className="pricing-badge pricing-badge-featured">online</span>
            </div>
            <div className="hero-node-grid">
              <article className="hero-node hero-node-entry">
                <span className="mini">Entrada</span>
                <strong>Mensagem recebida</strong>
                <p className="mini">A conversa entra no canal certo sem atraso.</p>
              </article>
              <article className="hero-node">
                <span className="mini">Bot</span>
                <strong>Resposta automática</strong>
                <p className="mini">Qualifica e conduz a conversa.</p>
              </article>
              <article className="hero-node hero-node-highlight hero-node-wide">
                <span className="mini">Repasse</span>
                <strong>Equipe comercial</strong>
                <p className="mini">Recebe contexto antes de assumir o contato.</p>
              </article>
            </div>
          </div>
          <div className="hero-note hero-note-premium">
            <strong>Pronta para operar</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Configure canais, ative fluxos e coloque sua automação no ar sem uma interface poluída.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
