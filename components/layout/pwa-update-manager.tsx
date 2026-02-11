'use client';

import { usePwaUpdate } from '@/hooks/usePwaUpdate';

export function PwaUpdateManager() {
  usePwaUpdate();
  return null;
}
