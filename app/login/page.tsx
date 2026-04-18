import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { Topbar } from "@/components/topbar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Entrar na Klio",
  description: "Acesse sua operação Klio e controle fluxos, integrações e atendimento em um único centro de comando.",
  openGraph: {
    title: "Entrar na Klio",
    description: "Acesse sua operação Klio e controle fluxos, integrações e atendimento em um único centro de comando.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Entrar na Klio",
    description: "Acesse sua operação Klio e controle fluxos, integrações e atendimento em um único centro de comando.",
    images: ["/logo.png"]
  }
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Topbar compactAuth />
      <AuthShell
        badge="Acesso seguro"
        title="Bem-vindo de volta"
        subtitle="Acesse sua operação"
        heading="Sua operação no piloto automático."
        bullets={["IA respondendo em segundos", "Fluxos multicanal ativos", "Equipe focada no que importa"]}
        quote={{
          initials: "LM",
          name: "Larissa Moura",
          role: "Gestora comercial",
          text: "A Klio transformou nosso atendimento em uma operação muito mais rápida, elegante e previsível."
        }}
      >
        <LoginForm />
      </AuthShell>
    </>
  );
}
