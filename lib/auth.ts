import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureSeedUser, findUserByCredentials } from "@/lib/repositories";

export type AppUser = {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  company: string;
};

const SESSION_COOKIE = "pulseflow_session";

export async function authenticate(email: string, password: string) {
  await ensureSeedUser();
  return findUserByCredentials(email, password);
}

export async function createSession(user: AppUser) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify({ id: user.id, tenantId: user.tenantId, email: user.email, name: user.name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { id: string; tenantId?: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
