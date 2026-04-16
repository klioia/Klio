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

const productNavGroups = [
  {
    label: "Operação",
    items: [
      { href: "/dashboard", label: "Overview", description: "Visão geral da operação", icon: "grid" },
      { href: "/inbox", label: "Inbox", description: "Atendimento e repasse humano", icon: "inbox" },
      { href: "/leads", label: "CRM", description: "Contatos, tags e funil", icon: "users" },
      { href: "/automations", label: "Flow Studio", description: "Builder visual de fluxos", icon: "workflow" }
    ]
  },
  {
    label: "Execução",
    items: [
      { href: "/executions", label: "Execuções", description: "Debug, logs e replay", icon: "pulse" },
      { href: "/scheduled", label: "Agendados", description: "Próximas etapas da fila", icon: "clock" },
      { href: "/analytics", label: "Analytics", description: "Resposta, conversão e gargalos", icon: "chart" }
    ]
  },
  {
    label: "Configuração",
    items: [
      { href: "/integrations", label: "Integrações", description: "Canais e credenciais", icon: "plug" },
      { href: "/settings", label: "Configurações", description: "Workspace, equipe e segurança", icon: "settings" }
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
    case "inbox":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4 5.5h12l-1 8.5H5L4 5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6.5 11.5h1.75l.9 1.25h1.7l.9-1.25h1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    case "chart":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M4.25 15.5V4.5M4.25 15.5h11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7.25 12.5v-3M10 12.5v-6M12.75 12.5v-4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 3.5v2M10 14.5v2M4.37 6.25l1.73 1M13.9 12.75l1.73 1M4.37 13.75l1.73-1M13.9 7.25l1.73-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
              Toda a operação de automação, atendimento e repasse organizada em um único núcleo.
            </p>
            <div className="workspace-status-list">
              <div className="workspace-status-row">
                <span>Monitoramento</span>
                <strong>Ativo</strong>
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
            {productNavGroups.map((group) => (
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
