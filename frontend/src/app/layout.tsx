import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radar Agrícola IA — Feira de Ciências",
  description: "Diagnósticos Fitossanitários Híbridos, Pragas Emblemáticas, Implementos e Manejo Integrado (MIP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#06110d] text-slate-100">
        {children}
      </body>
    </html>
  );
}
