"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";

type TopbarProps = {
  compactAuth?: boolean;
};

export function Topbar({ compactAuth = false }: TopbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`topbar${scrolled ? " topbar-scrolled" : ""}`}>
      <div className="shell topbar-inner">
        <Brand compact={compactAuth} />
        {compactAuth ? null : (
          <div className="topbar-actions">
            <nav className="nav-row mini topbar-nav">
              <a href="#recursos">Recursos</a>
              <a href="#flow-engine">Flow Engine</a>
              <a href="#automacoes">Como funciona</a>
              <a href="#planos">Planos</a>
            </nav>
            <a className="btn btn-secondary topbar-cta" href="/login">
              Entrar
            </a>
            <a className="btn btn-primary topbar-cta" href="/register">
              Começar agora
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
