"use client";

import type { ReactNode } from "react";
import { Brand } from "@/components/brand";

type AuthShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  heading: string;
  bullets: string[];
  quote?: {
    initials: string;
    name: string;
    role: string;
    text: string;
  };
  children: ReactNode;
};

export function AuthShell({ badge, title, subtitle, heading, bullets, quote, children }: AuthShellProps) {
  return (
    <main className="auth-canvas">
      <div className="auth-shell-grid">
        <aside className="auth-visual-panel">
          <div className="auth-visual-noise" />
          <div className="auth-visual-content">
            <div className="auth-brand-lockup">
              <Brand />
              <span className="auth-visual-badge">{badge}</span>
            </div>

            <div className="auth-visual-copy">
              <span className="auth-visual-kicker">Centro de controle conversacional</span>
              <h1 className="auth-visual-title">{heading}</h1>
              <p className="auth-visual-subtitle">{subtitle}</p>
            </div>

            <div className="auth-visual-checklist">
              {bullets.map((item) => (
                <div className="auth-check-row" key={item}>
                  <span className="auth-check-icon" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M5 10.5 8.2 13.7 15 6.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="auth-visual-metrics">
              <div className="auth-visual-metric">
                <span className="mini">Primeira resposta</span>
                <strong>6s</strong>
              </div>
              <div className="auth-visual-metric">
                <span className="mini">Cobertura</span>
                <strong>24/7</strong>
              </div>
              <div className="auth-visual-metric">
                <span className="mini">Canais</span>
                <strong>4</strong>
              </div>
            </div>

            {quote ? (
              <div className="auth-premium-quote">
                <div className="auth-premium-stars">★★★★★</div>
                <p>{quote.text}</p>
                <div className="auth-premium-profile">
                  <div className="auth-premium-avatar">{quote.initials}</div>
                  <div>
                    <strong>{quote.name}</strong>
                    <div className="mini">{quote.role}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <section className="auth-form-column">
          <div className="auth-form-stage">
            <div className="auth-form-frame">
              <div className="auth-form-header">
                <div className="auth-form-brand">
                  <div className="auth-form-brand-mark">
                    <img src="/logo.png" alt="Klio" className="h-10 w-10 rounded-2xl" />
                  </div>
                  <div>
                    <div className="auth-form-brand-title">Klio</div>
                    <div className="auth-form-brand-subtitle">Operação premium</div>
                  </div>
                </div>
                <div>
                  <h2 className="auth-form-title">{title}</h2>
                  <p className="auth-form-subtitle">{subtitle}</p>
                </div>
              </div>

              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
