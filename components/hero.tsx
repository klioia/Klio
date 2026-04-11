export function Hero() {
  return (
    <section className="section">
      <div className="shell hero-grid hero-grid-conversion">
        <div>
          <span className="eyebrow">Automacao de atendimento para vender mais</span>
          <h1 className="hero-title hero-title-conversion">
            Responda mais rapido, aproveite mais leads e venda sem depender de uma equipe grande.
          </h1>
          <p className="muted hero-copy">
            A Klio automatiza conversas no WhatsApp, Instagram, Messenger e Telegram para seu negocio atender melhor,
            organizar contatos e transformar mensagens em oportunidades reais.
          </p>
          <div className="cta-row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="/register">
              Automatizar meu atendimento
            </a>
            <a className="btn btn-secondary" href="#demo">
              Ver a Klio em acao
            </a>
          </div>
          <div className="hero-proof-row" style={{ marginTop: 18 }}>
            <span className="mini">Comece hoje sem equipe grande</span>
            <span className="mini">Respostas mais rapidas</span>
            <span className="mini">Mais vendas com menos operacao manual</span>
          </div>
        </div>
        <div className="hero-clean">
          <div className="card panel hero-surface hero-workspace hero-demo-board">
            <div className="hero-workspace-head">
              <div>
                <strong>Painel da Klio</strong>
                <div className="mini">atendimento, qualificacao e repasse no mesmo fluxo</div>
              </div>
              <span className="pricing-badge pricing-badge-featured">ao vivo</span>
            </div>
            <div className="demo-thread">
              <div className="demo-message demo-message-in">
                <span className="mini">Cliente</span>
                <strong>Oi, quero saber valores para minha clinica.</strong>
              </div>
              <div className="demo-message demo-message-out">
                <span className="mini">Klio</span>
                <strong>Perfeito. Posso te ajudar agora e entender o que voce precisa.</strong>
              </div>
            </div>
            <div className="hero-node-grid hero-node-grid-conversion">
              <article className="hero-node hero-node-entry">
                <span className="mini">Resposta imediata</span>
                <strong>Atende na hora</strong>
                <p className="mini">Seu lead nao fica esperando.</p>
              </article>
              <article className="hero-node">
                <span className="mini">Qualificacao</span>
                <strong>Entende o interesse</strong>
                <p className="mini">Organiza a conversa sem confusao.</p>
              </article>
              <article className="hero-node hero-node-highlight hero-node-wide">
                <span className="mini">Repasse inteligente</span>
                <strong>Entrega para o humano certo no momento certo</strong>
                <p className="mini">Seu time entra com contexto pronto para fechar.</p>
              </article>
            </div>
          </div>
          <div className="hero-note hero-note-premium">
            <strong>Mais clareza na operacao</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Todos os canais em uma unica plataforma, com atendimento mais rapido e menos trabalho manual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
