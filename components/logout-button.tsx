"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className={className ?? "btn btn-secondary"} onClick={handleLogout} type="button" disabled={loading}>
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {loading ? "Saindo..." : "Encerrar sessão"}
    </button>
  );
}
