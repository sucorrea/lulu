'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  requestNotificationPermission,
  hasNotificationPermission,
  getStoredFcmToken,
} from '@/services/fcm';

const STORAGE_KEY = 'lulu-notification-banner-dismissed';

interface NotificationHomeBannerProps {
  participantId?: string;
}

export const NotificationHomeBanner = ({
  participantId,
}: NotificationHomeBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!participantId) {
      return;
    }

    const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (wasDismissed) {
      return;
    }

    const checkStatus = async () => {
      if (hasNotificationPermission()) {
        const tokens = await getStoredFcmToken(participantId);
        if (tokens.length > 0) {
          return;
        }
      }
      setVisible(true);
    };

    checkStatus();
  }, [participantId]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }, []);

  const handleEnable = useCallback(async () => {
    if (!participantId) {
      return;
    }

    setIsLoading(true);
    const token = await requestNotificationPermission(participantId);
    setIsLoading(false);

    if (token) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    }
  }, [participantId]);

  if (!visible) {
    return null;
  }

  return (
    <div
      data-testid="notification-home-banner"
      className="relative mb-6 flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm"
    >
      <Bell className="h-5 w-5 shrink-0 text-primary" />
      <div className="flex-1">
        <p className="font-medium text-sm">
          Ativar notificações de aniversário
        </p>
        <p className="text-xs text-muted-foreground">
          Receba lembretes 5 dias antes e no dia do aniversário das lulus.
        </p>
      </div>
      <Button
        onClick={handleEnable}
        disabled={isLoading}
        size="sm"
        className="shrink-0"
      >
        {isLoading ? 'Ativando...' : 'Ativar'}
      </Button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fechar banner de notificações"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};
