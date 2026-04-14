"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

type AppShellProps = {
  userName: string;
  title: string;
  description: string;
  children: ReactNode;
};

const navGroups = [
  {
    label: "Operação",
    items: [
      { href: "/dashboard", label: "Overview", description: "Visão geral da operação", icon: "grid" },
      { href: "/leads", label: "Leads", description: "Fila e histórico de conversas", icon: "users" },
      { href: "/automations", label: "Fluxos", description: "Biblioteca e lógica ativa", icon: "workflow" }
    ]
  },
  {
    label: "Execução",
    items: [
      { href: "/executions", label: "Execuções", description: "Disparos e auditoria", icon: "pulse" },
      { href: "/scheduled", label: "Agendados", description: "Próximas etapas da fila", icon: "clock" },
      { href: "/worker", label: "Worker", description: "Motor e processamento", icon: "bolt" }
    ]
  },
  {
    label: "Configuração",
    items: [
      { href: "/integrations", label: "Integrações", description: "Canais e credenciais", icon: "plug" }
    ]
  }
];

function WorkspaceIcon({ name }: { name: string }) {
  switch (name) {
    case "grid":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4.5 4.5h4v4h-4zm7 0h4v4h-4zm-7 7h4v4h-4zm7 0h4v4h-4z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="7.25" r="2.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13.5" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.75 14c.48-1.87 2.04-2.875 3.95-2.875 1.9 0 3.46 1.005 3.925 2.875M11.75 13.75c.308-1.311 1.367-2.125 2.75-2.125 1.016 0 1.896.44 2.375 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "workflow":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M5 5h3.5v3.5H5zM11.5 11.5H15V15h-3.5zM5 11.5h3.5V15H5z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 6.75h3a2 2 0 0 1 2 2v2.75M8.5 13.25h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "pulse":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M2.5 10h3l1.75-3 2.25 6 2.25-4h5.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6.5v4l2.75 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M10.625 2.75 5.75 10h3.25l-.625 7.25L13.75 10H10.5l.125-7.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4.25 6.25h11.5v7.5H4.25z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function AppShell({ userName, title, description, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="workspace-sidebar-inner">
          <div className="workspace-brand">
            <Brand compact />
            <div className="workspace-badge-row">
              <span className="workspace-chip workspace-chip-live">Motor ativo</span>
              <span className="workspace-chip">Ambiente seguro</span>
            </div>
          </div>

          <div className="workspace-status-card">
            <span className="workspace-kicker">Workspace</span>
            <strong>Klio Command Center</strong>
            <p className="mini">
              Toda a operação de automação, atendimento e handoff organizada em um único núcleo.
            </p>
            <div className="workspace-status-list">
              <div className="workspace-status-row">
                <span>Disponibilidade</span>
                <strong>99,9%</strong>
              </div>
              <div className="workspace-status-row">
                <span>Camada ativa</span>
                <strong>Multicanal</strong>
              </div>
              <div className="workspace-status-row">
                <span>Operador</span>
                <strong>{userName}</strong>
              </div>
            </div>
          </div>

          <nav className="workspace-nav">
            {navGroups.map((group) => (
              <div className="workspace-nav-group" key={group.label}>
                <div className="workspace-nav-label">{group.label}</div>
                <div className="workspace-nav-list">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        className={`workspace-nav-link${active ? " workspace-nav-link-active" : ""}`}
                        href={item.href}
                        key={item.href}
                      >
                        <span className="workspace-nav-icon" aria-hidden="true">
                          <WorkspaceIcon name={item.icon} />
                        </span>
                        <span className="workspace-nav-copy">
                          <strong>{item.label}</strong>
                          <span>{item.description}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="workspace-sidebar-foot">
            <div className="workspace-trust-card">
              <span className="workspace-kicker">Segurança visual</span>
              <strong>Sessão protegida</strong>
              <p className="mini">Acesso com credenciais seguras, logout rápido e contexto operacional preservado.</p>
            </div>
            <LogoutButton className="workspace-logout-button" />
          </div>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-header">
          <div className="workspace-header-copy">
            <span className="workspace-kicker">Centro de comando</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="workspace-header-meta">
            <div className="workspace-meta-card">
              <span className="workspace-meta-label">Sessão</span>
              <strong>{userName}</strong>
            </div>
            <div className="workspace-meta-card">
              <span className="workspace-meta-label">Estado</span>
              <strong>Operando</strong>
            </div>
          </div>
        </header>

        <section className="workspace-content">{children}</section>
      </div>
    </main>
  );
}
