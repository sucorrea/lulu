import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { toast } from 'sonner';
import app from './firebase';
import { db } from './firebase';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const isBrowserSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'Notification' in window;

export const getMessagingInstance = () => {
  if (!isBrowserSupported()) {
    return null;
  }
  return getMessaging(app);
};

export const requestNotificationPermission = async (
  participantId: string
): Promise<string | null> => {
  if (!isBrowserSupported()) {
    toast.error('Seu navegador não suporta notificações push');
    return null;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    toast.error('Permissão de notificação negada');
    return null;
  }

  const messaging = getMessagingInstance();
  if (!messaging || !VAPID_KEY) {
    toast.error('Configuração FCM incompleta');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      const participantRef = doc(db, 'participants', participantId);
      await updateDoc(participantRef, {
        fcmTokens: arrayUnion(token),
      });
    }

    return token;
  } catch (error) {
    console.error('Erro ao obter token FCM:', error);
    toast.error('Erro ao ativar notificações');
    return null;
  }
};

export const removeNotificationToken = async (
  participantId: string,
  token: string
): Promise<void> => {
  const participantRef = doc(db, 'participants', participantId);
  await updateDoc(participantRef, {
    fcmTokens: arrayRemove(token),
  });
};

export const setupForegroundMessages = () => {
  const messaging = getMessagingInstance();
  if (!messaging) {
    return;
  }

  onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'Luluzinha';
    const body = payload.notification?.body ?? '';
    toast(title, { description: body });
  });
};

export const hasNotificationPermission = (): boolean => {
  if (!isBrowserSupported()) {
    return false;
  }
  return Notification.permission === 'granted';
};

export const getStoredFcmToken = async (
  participantId: string
): Promise<string[]> => {
  const participantRef = doc(db, 'participants', participantId);
  const snap = await getDoc(participantRef);
  if (snap.exists()) {
    return (snap.data().fcmTokens as string[]) ?? [];
  }
  return [];
};
