"use client";

import { motion } from "framer-motion";

const avatars = [
  { label: "WhatsApp", initials: "WA", className: "avatar-gradient-1" },
  { label: "Instagram", initials: "IG", className: "avatar-gradient-2" },
  { label: "Equipe", initials: "EQ", className: "avatar-gradient-3" },
  { label: "CRM", initials: "CRM", className: "avatar-gradient-4" }
];

export function Hero() {
  return (
    <section className="section hero-section" id="flow-engine">
      <div className="shell hero-layout">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="hero-badge-dot" />
            Novo: Flow Studio visual com IA integrada →
          </motion.span>

          <h1 className="hero-display">
            Automatize <span className="hero-gradient">atendimento</span>. Venda mais{" "}
            <span className="hero-gradient">sem bagunçar a operação</span>.
          </h1>
          <p className="hero-subtitle">
            A Klio Flow centraliza mensagens, qualifica leads, roda fluxos visuais e entrega conversas para humanos no momento certo.
          </p>

          <div className="cta-row hero-actions">
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn btn-primary hero-primary-cta" href="/register">
              Começar agora
            </motion.a>
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn btn-secondary hero-secondary-cta" href="#automacoes">
              Ver demo
            </motion.a>
          </div>

          <div className="hero-proof-row">
            <span className="mini">WhatsApp e Instagram</span>
            <span className="mini">Fluxos visuais</span>
            <span className="mini">Debug por execução</span>
          </div>

          <div className="hero-social-proof">
            <div className="hero-avatars">
              {avatars.map((avatar) => (
                <span key={avatar.label} className={`avatar ${avatar.className}`}>
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div>
              <strong>Produto focado em vendas, atendimento e repasse humano</strong>
              <div className="hero-stars">Pronto para operar com dados reais, não planilhas soltas.</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual-wrap"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero-dashboard"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hero-dashboard-top">
              <div>
                <strong>Klio Flow Engine</strong>
                <div className="mini">automação ativa em tempo real</div>
              </div>
              <span className="status-pill status-pill-success">
                <span className="status-dot" />
                online
              </span>
            </div>

            <div className="hero-dashboard-grid">
              <article className="hero-panel hero-panel-large">
                <span className="mini">Entrada</span>
                <strong>Mensagem recebida no Instagram</strong>
                <p className="mini">Lead pediu orçamento e a Klio iniciou a triagem automaticamente.</p>
              </article>
              <article className="hero-panel">
                <span className="mini">Bot</span>
                <strong>Qualificação automática</strong>
                <p className="mini">Pergunta intenção, urgência e canal preferido.</p>
              </article>
              <article className="hero-panel">
                <span className="mini">Equipe</span>
                <strong>Repasse com contexto</strong>
                <p className="mini">O vendedor recebe a conversa já pronta para fechar.</p>
              </article>
              <article className="hero-panel hero-panel-wide">
                <div className="hero-mini-metrics">
                  <div>
                    <span className="mini">demo · resposta</span>
                    <strong>12s</strong>
                  </div>
                  <div>
                    <span className="mini">demo · leads</span>
                    <strong>84</strong>
                  </div>
                  <div>
                    <span className="mini">demo · fluxos</span>
                    <strong>42</strong>
                  </div>
                </div>
              </article>
            </div>
          </motion.div>
          <div className="hero-dashboard-reflection" />
        </motion.div>
      </div>
    </section>
  );
}
