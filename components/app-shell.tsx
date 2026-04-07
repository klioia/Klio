import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

type AppShellProps = {
  userName: string;
  title: string;
  description: string;
  children: ReactNode;
};

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/automations", label: "Automacoes" },
  { href: "/executions", label: "Execucoes" },
  { href: "/scheduled", label: "Agendados" },
  { href: "/worker", label: "Worker" },
  { href: "/integrations", label: "Integracoes" }
];

export function AppShell({ userName, title, description, children }: AppShellProps) {
  return (
    <main className="section">
      <div className="shell dashboard-grid">
        <aside className="card panel">
          <span className="eyebrow">Workspace</span>
          <div style={{ margin: "10px 0 6px" }}>
            <Brand compact />
          </div>
          <h2 style={{ marginBottom: 6 }}>Klio Control Grid</h2>
          <p className="mini">Logado como {userName}</p>
          <div className="workspace-status" style={{ marginTop: 18 }}>
            <div className="workspace-status-dot" />
            <span className="mini">Orquestrador online</span>
          </div>
          <div style={{ marginTop: 18 }}>
            <LogoutButton />
          </div>
          <div className="flow-list" style={{ marginTop: 22 }}>
            {links.map((link) => (
              <Link className="workspace-link" href={link.href} key={link.href}>
                <strong>{link.label}</strong>
                <span className="mini">abrir modulo</span>
              </Link>
            ))}
          </div>
        </aside>
        <section>
          <span className="eyebrow">Operacao</span>
          <h1 className="section-title">{title}</h1>
          <p className="muted">{description}</p>
          <div style={{ marginTop: 24 }}>{children}</div>
        </section>
      </div>
    </main>
  );
}
