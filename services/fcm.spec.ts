import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockGetMessaging = vi.fn();
const mockGetToken = vi.fn();
const mockOnMessage = vi.fn();
const mockDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockArrayUnion = vi.fn((val) => val);
const mockArrayRemove = vi.fn((val) => val);
const mockGetDoc = vi.fn();
const mockToast = vi.fn();
const mockToastError = vi.fn();

vi.mock('firebase/messaging', () => ({
  getMessaging: (...args: unknown[]) => mockGetMessaging(...args),
  getToken: (...args: unknown[]) => mockGetToken(...args),
  onMessage: (...args: unknown[]) => mockOnMessage(...args),
}));

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  arrayUnion: (...args: unknown[]) => mockArrayUnion([...args]),
  arrayRemove: (...args: unknown[]) => mockArrayRemove([...args]),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
}));

vi.mock('sonner', () => ({
  toast: Object.assign((...args: unknown[]) => mockToast(...args), {
    error: (...args: unknown[]) => mockToastError(...args),
  }),
}));

vi.mock('./firebase', () => ({
  default: { name: 'mock-app' },
  db: {},
}));

describe('fcm', () => {
  let originalWindow: typeof globalThis.window;
  let originalNavigator: typeof globalThis.navigator;
  let originalNotification: typeof globalThis.Notification;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    originalWindow = globalThis.window;
    originalNavigator = globalThis.navigator;
    originalNotification = globalThis.Notification;

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        serviceWorker: {
          ready: Promise.resolve({} as ServiceWorkerRegistration),
        },
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'Notification', {
      value: {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('granted'),
      },
      writable: true,
      configurable: true,
    });

    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY = 'test-vapid-key';
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'Notification', {
      value: originalNotification,
      writable: true,
      configurable: true,
    });
    delete process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  });

  describe('getMessagingInstance', () => {
    it('should return messaging when browser is supported', async () => {
      mockGetMessaging.mockReturnValue({ messaging: true });
      const { getMessagingInstance } = await import('./fcm');
      const result = getMessagingInstance();
      expect(result).toEqual({ messaging: true });
    });

    it('should return null when not in browser', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      const { getMessagingInstance } = await import('./fcm');
      const result = getMessagingInstance();
      expect(result).toBeNull();
    });
  });

  describe('hasNotificationPermission', () => {
    it('should return true when permission is granted', async () => {
      Object.defineProperty(Notification, 'permission', {
        value: 'granted',
        configurable: true,
      });
      const { hasNotificationPermission } = await import('./fcm');
      expect(hasNotificationPermission()).toBe(true);
    });

    it('should return false when permission is denied', async () => {
      Object.defineProperty(Notification, 'permission', {
        value: 'denied',
        configurable: true,
      });
      const { hasNotificationPermission } = await import('./fcm');
      expect(hasNotificationPermission()).toBe(false);
    });
  });

  describe('requestNotificationPermission', () => {
    it('should return token on success', async () => {
      mockGetMessaging.mockReturnValue({ messaging: true });
      mockGetToken.mockResolvedValue('fcm-token-123');
      mockUpdateDoc.mockResolvedValue(undefined);
      Object.defineProperty(Notification, 'requestPermission', {
        value: vi.fn().mockResolvedValue('granted'),
        configurable: true,
      });

      const { requestNotificationPermission } = await import('./fcm');
      const result = await requestNotificationPermission('p1');

      expect(result).toBe('fcm-token-123');
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it('should return null when permission denied', async () => {
      Object.defineProperty(Notification, 'requestPermission', {
        value: vi.fn().mockResolvedValue('denied'),
        configurable: true,
      });

      const { requestNotificationPermission } = await import('./fcm');
      const result = await requestNotificationPermission('p1');

      expect(result).toBeNull();
      expect(mockToastError).toHaveBeenCalledWith(
        'Permissão de notificação negada'
      );
    });

    it('should return null when browser not supported', async () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { requestNotificationPermission } = await import('./fcm');
      const result = await requestNotificationPermission('p1');

      expect(result).toBeNull();
    });
  });

  describe('removeNotificationToken', () => {
    it('should remove token from participant', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      const { removeNotificationToken } = await import('./fcm');
      await removeNotificationToken('p1', 'old-token');

      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(mockArrayRemove).toHaveBeenCalledWith(['old-token']);
    });
  });

  describe('setupForegroundMessages', () => {
    it('should register onMessage callback', async () => {
      mockGetMessaging.mockReturnValue({ messaging: true });
      const { setupForegroundMessages } = await import('./fcm');
      setupForegroundMessages();

      expect(mockOnMessage).toHaveBeenCalled();
    });

    it('should show toast when message received', async () => {
      mockGetMessaging.mockReturnValue({ messaging: true });
      mockOnMessage.mockImplementation((_messaging, callback) => {
        callback({
          notification: { title: 'Test Title', body: 'Test Body' },
        });
      });

      const { setupForegroundMessages } = await import('./fcm');
      setupForegroundMessages();

      expect(mockToast).toHaveBeenCalledWith('Test Title', {
        description: 'Test Body',
      });
    });

    it('should use default title when notification title is missing', async () => {
      mockGetMessaging.mockReturnValue({ messaging: true });
      mockOnMessage.mockImplementation((_messaging, callback) => {
        callback({ notification: {} });
      });

      const { setupForegroundMessages } = await import('./fcm');
      setupForegroundMessages();

      expect(mockToast).toHaveBeenCalledWith('Luluzinha', {
        description: '',
      });
    });
  });

  describe('getStoredFcmToken', () => {
    it('should return tokens when doc exists', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ fcmTokens: ['token1', 'token2'] }),
      });

      const { getStoredFcmToken } = await import('./fcm');
      const tokens = await getStoredFcmToken('p1');

      expect(tokens).toEqual(['token1', 'token2']);
    });

    it('should return empty array when doc does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const { getStoredFcmToken } = await import('./fcm');
      const tokens = await getStoredFcmToken('p1');

      expect(tokens).toEqual([]);
    });

    it('should return empty array when fcmTokens is undefined', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      });

      const { getStoredFcmToken } = await import('./fcm');
      const tokens = await getStoredFcmToken('p1');

      expect(tokens).toEqual([]);
    });
  });
});
