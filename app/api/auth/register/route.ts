import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { createUser } from "@/lib/repositories";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      company: body.company
    });

    await createSession(user);

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Falha ao criar usuario."
      },
      { status: 400 }
    );
  }
}
