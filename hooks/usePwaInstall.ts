'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'pwa-install-dismissed';
const SESSION_KEY = 'pwa-install-shown';
const TOAST_ID = 'pwa-install';

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

const wasShownInSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

const markShownInSession = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
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
    id: TOAST_ID,
    duration: 12000,
    closeButton: true,
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
    id: TOAST_ID,
    duration: 15000,
    closeButton: true,
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
      wasDismissed() ||
      wasShownInSession()
    ) {
      return;
    }

    if (isIosSafari()) {
      markShownInSession();
      showIosToast();
      return;
    }

    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as BeforeInstallPromptEvent;
      if (wasShownInSession()) {
        return;
      }
      markShownInSession();
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
