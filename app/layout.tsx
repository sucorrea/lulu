import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
const ano = new Date().getFullYear();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `Luluzinha ${ano}`,
  description: 'O blog da Luluzinha',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <main>
        {children}
            <footer className="mx-auto flex w-full items-center justify-center gap-4 border-t text-center text-xs">
        <p className="text-center text-xs">
           &copy; {ano} Luluzinha. All rights reserved.
        </p>
      </footer>
</main>
      </body>
    </html>
  );
}
