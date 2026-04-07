"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProcessJobsButton() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleProcess() {
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/automations/process", {
      method: "POST"
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Falha ao processar pendencias.");
      setLoading(false);
      return;
    }

    setStatus(`Processadas: ${data.processed} - Pendentes: ${data.pending}`);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flow-list">
      <button className="btn btn-primary" disabled={loading} onClick={handleProcess} type="button">
        {loading ? "Processando..." : "Processar pendencias"}
      </button>
      {status ? <span className="mini">{status}</span> : null}
    </div>
  );
}
