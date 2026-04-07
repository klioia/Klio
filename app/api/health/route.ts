import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "Klio",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    storage: hasDatabaseUrl() ? "postgresql" : "json",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    workerPollMs: Number(process.env.WORKER_POLL_MS || 30000)
  });
}
