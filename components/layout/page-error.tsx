'use client';

import { useRouter } from 'next/navigation';

import ErrorState from '@/components/error-state';

interface PageErrorProps {
  title?: string;
  message?: string;
}

const PageError = ({ title, message }: PageErrorProps) => {
  const router = useRouter();

  return (
    <ErrorState
      title={title}
      message={message}
      onRetry={() => router.refresh()}
    />
  );
};

export default PageError;
