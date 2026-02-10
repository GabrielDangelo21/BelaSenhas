import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bela-Senhas | Gerenciador de Senhas",
  description: "Gerenciador de senhas local, seguro e elegante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body className={`${outfit.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
