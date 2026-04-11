import { Brand } from "@/components/brand";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        <Brand />
        <div className="topbar-actions">
          <nav className="nav-row mini topbar-nav">
            <a href="#recursos">Recursos</a>
            <a href="#automacoes">Demo</a>
            <a href="#planos">Planos</a>
            <a href="/login">Entrar</a>
          </nav>
          <a className="btn btn-secondary topbar-cta" href="/login">
            Entrar
          </a>
          <a className="btn btn-primary topbar-cta" href="/register">
            Começar grátis
          </a>
        </div>
      </div>
    </header>
  );
}

