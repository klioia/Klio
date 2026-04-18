import { NextRequest, NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";

function invalidResponse(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Email ou senha inválidos." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "Email ou senha inválidos.");
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  let email = "";
  let password = "";
  let redirectTo = "/dashboard";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    email = String(body.email || "");
    password = String(body.password || "");
    redirectTo = String(body.redirectTo || "/dashboard");
  } else {
    const formData = await request.formData();
    email = String(formData.get("email") || "");
    password = String(formData.get("password") || "");
    redirectTo = String(formData.get("redirectTo") || "/dashboard");
  }

  const user = await authenticate(email, password);

  if (!user) {
    return invalidResponse(request);
  }

  await createSession(user);

  if (contentType.includes("application/json")) {
    return NextResponse.json({
      ok: true,
      redirectTo,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company
      }
    });
  }

  return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
}
