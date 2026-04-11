import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://klioflow.online"),
  title: {
    default: "Klio | Automação conversacional",
    template: "%s | Klio"
  },
  description: "Automação conversacional para equipes que precisam responder rápido e vender mais com WhatsApp e Instagram.",
  icons: {
    icon: "/logo.png"
  },
  openGraph: {
    title: "Klio | Automação conversacional",
    description: "Automação conversacional para equipes que precisam responder rápido e vender mais com WhatsApp e Instagram.",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Klio | Automação conversacional",
    description: "Automação conversacional para equipes que precisam responder rápido e vender mais com WhatsApp e Instagram.",
    images: ["/logo.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
