import { NextResponse } from "next/server";
import { processDueJobs } from "@/lib/dispatch";

export async function POST() {
  try {
    const result = await processDueJobs();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao processar pendencias."
      },
      { status: 500 }
    );
  }
}
