'use client';

import { useEffect, useState } from 'react';

import { incrementSiteVisits } from '@/app/actions/visits';
import { listenSiteVisits } from '@/services/siteStats';

const STORAGE_KEY = 'lulu_visited';

export const VisitCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = listenSiteVisits(setCount);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, '1');
    void incrementSiteVisits();
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <p
      className="py-4 text-center text-xs text-muted-foreground"
      title="Total de acessos ao site"
      aria-label={`Site acessado ${count} vezes`}
    >
      👀 {count.toLocaleString('pt-BR')} acessos
    </p>
  );
};
