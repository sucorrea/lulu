'use client';

import { useEffect } from 'react';

import ErrorState from '@/components/error-state';

import './globals.css';

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error boundary caught:', error);
    }
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
          <ErrorState
            title="Ops! Algo deu errado"
            message="Ocorreu um erro crítico na aplicação. Por favor, recarregue a página ou tente novamente."
            onRetry={reset}
          />
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
