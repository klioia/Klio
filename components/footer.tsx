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
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Carreiras", href: "#" }
    ]
  },
  {
    title: "Suporte",
    links: [
      { label: "Docs", href: "#" },
      { label: "Status", href: "#" },
      { label: "Contato", href: "#" }
    ]
  }
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" }
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <Brand compact />
          <p className="mini">
            Automação conversacional para equipes que querem responder mais rápido e vender com mais consistência.
          </p>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
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
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
