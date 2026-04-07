"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AutoProcessJobsProps = {
  intervalMs?: number;
};

export function AutoProcessJobs({ intervalMs = 30000 }: AutoProcessJobsProps) {
  const router = useRouter();
  const runningRef = useRef(false);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState("Auto-run ativo");

  useEffect(() => {
    if (!enabled) {
      setStatus("Auto-run pausado");
      return;
    }

    async function tick() {
      if (runningRef.current) {
        return;
      }

      runningRef.current = true;

      try {
        const response = await fetch("/api/automations/process", {
          method: "POST"
        });
        const data = await response.json();

        if (response.ok) {
          setStatus(`Auto-run ativo - Processadas: ${data.processed} - Pendentes: ${data.pending}`);

          if (data.processed > 0) {
            router.refresh();
          }
        } else {
          setStatus(data.error || "Falha no auto-run");
        }
      } catch {
        setStatus("Falha no auto-run");
      } finally {
        runningRef.current = false;
      }
    }

    tick();
    const timer = window.setInterval(tick, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs, router]);

  return (
    <div className="auto-run-box">
      <div>
        <strong>Auto-processamento</strong>
        <div className="mini">{status}</div>
      </div>
      <button className="btn btn-secondary" onClick={() => setEnabled((value) => !value)} type="button">
        {enabled ? "Pausar" : "Ativar"}
      </button>
    </div>
  );
}
