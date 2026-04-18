import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";
import { Topbar } from "@/components/topbar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Criar conta grátis",
  description: "Crie sua conta na Klio, conecte seus canais e comece a automatizar o atendimento com visual e operação premium.",
  openGraph: {
    title: "Criar conta grátis",
    description: "Crie sua conta na Klio, conecte seus canais e comece a automatizar o atendimento com visual e operação premium.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Criar conta grátis",
    description: "Crie sua conta na Klio, conecte seus canais e comece a automatizar o atendimento com visual e operação premium.",
    images: ["/logo.png"]
  }
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Topbar compactAuth />
      <AuthShell
        badge="Teste gratuito"
        title="Crie sua conta grátis"
        subtitle="Sem cartão de crédito. Cancele quando quiser."
        heading="Comece a automatizar hoje."
        bullets={["Configure em menos de 5 minutos", "Teste grátis por 7 dias", "Cancele quando quiser", "Suporte incluído"]}
        quote={{
          initials: "RC",
          name: "Renato Cruz",
          role: "Operações digitais",
          text: "A entrada foi rápida, o produto passou segurança e o time já conseguiu publicar o primeiro fluxo no mesmo dia."
        }}
      >
        <RegisterForm />
      </AuthShell>
    </>
  );
}
