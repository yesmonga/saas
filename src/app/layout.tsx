import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResellHub - Gestion de Stock",
  description: "SaaS de gestion de stock pour l'achat-revente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Sidebar />
        <PageWrapper>{children}</PageWrapper>
        <Toaster />
      </body>
    </html>
  );
}
