import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Topbar } from "@/components/topbar";

export const metadata: Metadata = {
  title: "Recuperar acesso",
  description: "Recupere seu acesso à Klio com segurança e volte para sua operação em poucos minutos.",
  openGraph: {
    title: "Recuperar acesso",
    description: "Recupere seu acesso à Klio com segurança e volte para sua operação em poucos minutos.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Recuperar acesso",
    description: "Recupere seu acesso à Klio com segurança e volte para sua operação em poucos minutos.",
    images: ["/logo.png"]
  }
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Topbar compactAuth />
      <AuthShell
        badge="Recuperação"
        title="Recuperar acesso"
        subtitle="Digite seu e-mail e enviaremos as instruções."
        heading="Segurança sem fricção para voltar ao controle."
        bullets={[
          "Recuperação rápida e guiada",
          "Sessão protegida e confiável",
          "Mesmo padrão visual da sua operação"
        ]}
      >
        <ForgotPasswordForm />
      </AuthShell>
    </>
  );
}
