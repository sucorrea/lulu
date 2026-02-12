import { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';

import Footer from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navigation-bar/navbar';
import { PwaUpdateManager } from '@/components/layout/pwa-update-manager';
import { DeviceProvider } from '@/providers/device-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const ano = new Date().getFullYear();

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://luluzinha.web.app'
  ),
  title: `Luluzinha ${ano}`,
  description:
    'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard, histórico e auditoria em tempo real.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Luluzinha',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: `Luluzinha ${ano}`,
    description:
      'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard e auditoria em tempo real.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Luluzinha ${ano}`,
    description:
      'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard e auditoria em tempo real.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DeviceProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
              >
                Pular para conteúdo principal
              </a>
              <Navbar />
              <main id="main-content" className="pb-20">
                {children}
              </main>
              <Footer />
            </DeviceProvider>
            <PwaUpdateManager />
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
