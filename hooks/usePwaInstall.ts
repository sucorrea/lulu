'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'pwa-install-dismissed';

const isAlreadyInstalled = () =>
  globalThis.window?.matchMedia('(display-mode: standalone)').matches;

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
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  const isIosUa = /iphone|ipad|ipod/i.test(ua);
  const isIpadOs = /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  return (isIosUa || isIpadOs) && isSafari;
};

const showIosToast = () => {
  toast('Instale o app Luluzinha!', {
    description: 'Toque em Compartilhar ↑ e depois "Adicionar à Tela Início".',
    duration: 12000,
    onDismiss: markDismissed,
  });
};

const handleInstallClick = (
  getPrompt: () => BeforeInstallPromptEvent | null,
  clearPrompt: () => void
) => {
  const prompt = getPrompt();
  if (!prompt) {
    return;
  }
  prompt.prompt();
  prompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      markDismissed();
    }
    clearPrompt();
  });
};

const showInstallToast = (
  getPrompt: () => BeforeInstallPromptEvent | null,
  clearPrompt: () => void
) => {
  toast('Instale o app Luluzinha!', {
    description: 'Adicione ao seu dispositivo para acesso rápido.',
    duration: Infinity,
    action: {
      label: 'Instalar',
      onClick: () => handleInstallClick(getPrompt, clearPrompt),
    },
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
      showInstallToast(
        () => deferredPrompt,
        () => {
          deferredPrompt = null;
        }
      );
    };

    globalThis.window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    return () => {
      globalThis.window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);
};
