'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUserVerification } from '@/hooks/user-verify';
import {
  requestNotificationPermission,
  hasNotificationPermission,
  getStoredFcmToken,
} from '@/services/fcm';

export const NotificationOptIn = () => {
  const { participantId } = useUserVerification();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!participantId) {
      return;
    }

    const checkStatus = async () => {
      if (hasNotificationPermission()) {
        const tokens = await getStoredFcmToken(participantId);
        setIsEnabled(tokens.length > 0);
      }
    };

    checkStatus();
  }, [participantId]);

  const handleEnable = async () => {
    if (!participantId) {
      return;
    }

    setIsLoading(true);
    const token = await requestNotificationPermission(participantId);
    setIsEnabled(!!token);
    setIsLoading(false);
  };

  if (!participantId) {
    return null;
  }

  if (isEnabled) {
    return (
      <div className="flex items-center gap-3 p-4 border rounded-md bg-muted/50">
        <Bell className="h-5 w-5 text-success" />
        <div>
          <p className="font-medium">Notificações ativadas</p>
          <p className="text-sm text-muted-foreground">
            Você receberá lembretes de aniversário das lulus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 border rounded-md">
      <BellOff className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="font-medium">Ativar notificações de aniversário</p>
        <p className="text-sm text-muted-foreground">
          Receba lembretes 5 dias antes e no dia do aniversário das lulus.
        </p>
      </div>
      <Button onClick={handleEnable} disabled={isLoading} size="sm">
        {isLoading ? 'Ativando...' : 'Ativar'}
      </Button>
    </div>
  );
};
