import { NextRequest, NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await authenticate(body.email, body.password);

  if (!user) {
    return NextResponse.json({ ok: false, error: "Email ou senha inválidos." }, { status: 401 });
  }

  await createSession(user);

  return NextResponse.json({
    ok: true,
    redirectTo: "/dashboard",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company
    }
  });
}
