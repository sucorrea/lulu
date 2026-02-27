'use client';

import { useEffect } from 'react';
import { setupForegroundMessages } from '@/services/fcm';

export const FcmForegroundHandler = () => {
  useEffect(() => {
    setupForegroundMessages();
  }, []);

  return null;
};
