import type { Metadata } from 'next';

import {
  Camera,
  Database,
  LayoutDashboard,
  Loader2,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';

export const revalidate = false;

export const metadata: Metadata = {
  title: 'Sobre | Luluzinha',
  description:
    'Conheça o projeto Luluzinha - PWA para organizar vaquinhas de aniversário entre amigas. Stack: Next.js, React, Firebase, TypeScript.',
};

const STACK_ITEMS = [
  {
    icon: Zap,
    title: 'Frontend Moderno',
    items: [
      'Next.js 16 (App Router)',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Radix UI',
    ],
  },
  {
    icon: Database,
    title: 'Backend & Real-Time',
    items: ['Firebase Auth', 'Firestore', 'Storage', 'Listeners em tempo real'],
  },
  {
    icon: Smartphone,
    title: 'PWA & Performance',
    items: [
      'Service Worker (Serwist)',
      'Offline-First',
      'Instalável',
      'Cache inteligente',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Estado & Dados',
    items: ['TanStack React Query', 'React Hook Form', 'Zod', 'TanStack Table'],
  },
  {
    icon: Shield,
    title: 'Qualidade',
    items: [
      '85%+ Cobertura de testes',
      'Vitest + RTL',
      'SonarCloud',
      'ESLint + Prettier',
    ],
  },
  {
    icon: Camera,
    title: 'Features',
    items: [
      'Galeria com likes',
      'Dashboard analítico',
      'Sistema de auditoria',
      'Histórico de vaquinhas',
    ],
  },
];

const SobrePage = () => {
  return (
    <PageLayout>
      <Header
        title="Sobre o Projeto"
        description="O Luluzinha é um Progressive Web App criado para organizar vaquinhas de aniversário entre um grupo de amigas. Também serve como projeto de portfólio, demonstrando habilidades em desenvolvimento full-stack moderno."
      />
      <div className="rounded-2xl border border-border bg-card/80 p-4 md:p-6">
        <h2 className="lulu-header mb-4 text-xl md:text-2xl">
          O que é o Luluzinha?
        </h2>
        <p className="text-muted-foreground mb-4">
          Uma aplicação colaborativa onde o grupo gerencia participantes,
          sorteia quem presenteia quem, compartilha fotos na galeria, acompanha
          o histórico de vaquinhas e mantém um registro completo de alterações
          por meio do sistema de auditoria.
        </p>
        <p className="text-muted-foreground">
          O app é instalável em celulares e computadores, funciona offline e
          atualiza em tempo real quando alguém faz alterações.
        </p>
      </div>

      <div>
        <h2 className="lulu-header mb-6 text-xl md:text-2xl">
          Stack Tecnológica
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STACK_ITEMS.map(({ icon: Icon, title, items }) => (
            <Card
              key={title}
              className="lulu-card border-border bg-card/80 transition-shadow hover:shadow-lulu-sm"
            >
              <CardContent className="p-4 md:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-border bg-card/80">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-center md:text-left">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="size-8 text-primary" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Desenvolvido por Su
              </h3>
              <p className="text-sm text-muted-foreground">
                Transformando ideias em experiências digitais acessíveis e
                performáticas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default SobrePage;
