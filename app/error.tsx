'use client';

import { useEffect } from 'react';

import ErrorState from '@/components/error-state';

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorFallback({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  return (
    <div className="container py-10 md:py-14">
      <ErrorState
        title="Ops! Algo deu errado"
        message="Ocorreu um erro inesperado. Por favor, tente novamente."
        onRetry={reset}
      />
    </div>
  );
}
