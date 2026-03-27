'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'pwa-install-dismissed';

const isAlreadyInstalled = () =>
  globalThis.window !== undefined &&
  window.matchMedia('(display-mode: standalone)').matches;

const wasDismissed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const markDismissed = () => {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {}
};

const isIosSafari = () => {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  return isIos && isSafari;
};

const showIosToast = () => {
  toast('Instale o app Luluzinha!', {
    description: 'Toque em Compartilhar ↑ e depois "Adicionar à Tela Início".',
    duration: 12000,
    onDismiss: markDismissed,
  });
};

export const usePwaInstall = () => {
  useEffect(() => {
    if (
      globalThis.window === undefined ||
      isAlreadyInstalled() ||
      wasDismissed()
    ) {
      return;
    }

    if (isIosSafari()) {
      showIosToast();
      return;
    }

    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as BeforeInstallPromptEvent;

      toast('Instale o app Luluzinha!', {
        description: 'Adicione ao seu dispositivo para acesso rápido.',
        duration: Infinity,
        action: {
          label: 'Instalar',
          onClick: () => {
            if (!deferredPrompt) {
              return;
            }
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
              if (choice.outcome === 'accepted') {
                markDismissed();
              }
              deferredPrompt = null;
            });
          },
        },
        onDismiss: markDismissed,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);
};
