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
      { label: "Entrar", href: "/login" },
      { label: "Criar conta", href: "/register" },
      { label: "Painel", href: "/dashboard" }
    ]
  },
  {
    title: "Canais",
    links: [
      { label: "WhatsApp", href: "#recursos" },
      { label: "Instagram", href: "#recursos" },
      { label: "Messenger e Telegram", href: "#recursos" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <strong>Klio</strong>
          <p className="mini">Automação conversacional para equipes que querem responder mais rápido e vender com mais consistência.</p>
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
    </footer>
  );
}

