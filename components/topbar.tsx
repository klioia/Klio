import { Brand } from "@/components/brand";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        <Brand />
        <div className="topbar-actions">
          <nav className="nav-row mini topbar-nav">
            <a href="#planos">Planos</a>
            <a href="#impacto">Impacto</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/integrations">Integracoes</a>
          </nav>
          <a className="btn btn-secondary topbar-cta" href="/register">
            Entrar na Klio
          </a>
        </div>
      </div>
    </header>
  );
}
