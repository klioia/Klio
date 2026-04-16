import { Brand } from "@/components/brand";

const footerColumns = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Planos", href: "#planos" },
      { label: "Demo", href: "#automacoes" }
    ]
  },
  {
    title: "Operação",
    links: [
      { label: "Flow Studio", href: "/automations" },
      { label: "Execuções", href: "/executions" },
      { label: "Integrações", href: "/integrations" }
    ]
  },
  {
    title: "Suporte",
    links: [
      { label: "Status", href: "#" },
      { label: "Contato", href: "https://instagram.com/klioflow" },
      { label: "Privacidade", href: "/privacy" }
    ]
  }
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/klioflow" },
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" }
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <Brand compact />
          <p className="mini">Automação conversacional para equipes que querem responder melhor, vender com contexto e operar sem bagunça.</p>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-grid">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <div className="footer-title">{column.title}</div>
              <div className="footer-links">
                {column.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span className="mini">© 2026 Klio. Todos os direitos reservados.</span>
        <div className="footer-legal">
          <a href="/terms">Termos</a>
          <a href="/privacy">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
