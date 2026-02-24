'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const ONE_HOUR = 60 * 60 * 1000;

const showUpdateToast = (worker: ServiceWorker) => {
  toast.success('Nova versão disponível!', {
    description: 'Recarregue a página para atualizar.',
    duration: 10000,
    action: {
      label: 'Atualizar',
      onClick: () => {
        worker.postMessage({ type: 'SKIP_WAITING' });
        globalThis.location.reload();
      },
    },
  });
};

export const usePwaUpdate = () => {
  useEffect(() => {
    const isServiceWorkerUnavailable =
      globalThis.window === undefined ||
      !('serviceWorker' in navigator) ||
      !navigator.serviceWorker;

    if (isServiceWorkerUnavailable) {
      return;
    }

    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const handleStateChange = (
      worker: ServiceWorker,
      isCancelled: () => boolean
    ) => {
      const isInstalled = worker.state === 'installed';
      const hasController = navigator.serviceWorker?.controller;

      if (isInstalled && hasController && !isCancelled()) {
        showUpdateToast(worker);
      }
    };

    const attachStateChangeListener = (
      registration: ServiceWorkerRegistration,
      isCancelled: () => boolean
    ) => {
      const newWorker = registration.installing;
      if (!newWorker) {
        return undefined;
      }

      const stateChangeListener = () =>
        handleStateChange(newWorker, isCancelled);
      newWorker.addEventListener('statechange', stateChangeListener);

      return () =>
        newWorker.removeEventListener('statechange', stateChangeListener);
    };

    const addUpdateFoundListener = (
      registration: ServiceWorkerRegistration,
      isCancelled: () => boolean,
      updateDetachStateChange: (detach?: () => void) => void
    ) => {
      const handleUpdateFound = () => {
        const detach = attachStateChangeListener(registration, isCancelled);
        updateDetachStateChange(detach);
      };

      registration.addEventListener('updatefound', handleUpdateFound);

      return () => {
        if (typeof registration.removeEventListener === 'function') {
          registration.removeEventListener('updatefound', handleUpdateFound);
        }
      };
    };

    const pollRegistration = (registration: ServiceWorkerRegistration) =>
      registration.update().catch(() => {});

    const startUpdatePolling = (registration: ServiceWorkerRegistration) =>
      setInterval(() => pollRegistration(registration), ONE_HOUR);

    const setupRegistration = (registration: ServiceWorkerRegistration) => {
      let detachStateChange: (() => void) | undefined;

      const removeUpdateFoundListener = addUpdateFoundListener(
        registration,
        () => cancelled,
        (detach) => {
          detachStateChange?.();
          detachStateChange = detach;
        }
      );

      const interval = startUpdatePolling(registration);

      cleanup = () => {
        detachStateChange?.();
        removeUpdateFoundListener();
        clearInterval(interval);
      };
    };

    navigator.serviceWorker.ready
      .then((registration) => {
        if (!cancelled) {
          setupRegistration(registration);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
};
