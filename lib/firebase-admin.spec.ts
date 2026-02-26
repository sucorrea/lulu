import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockApp = { name: 'mock-app' };
const mockInitializeApp = vi.fn(() => mockApp);
const mockGetApp = vi.fn(() => mockApp);
const mockCert = vi.fn((creds) => creds);
const mockApplicationDefault = vi.fn(() => 'applicationDefault');
const mockAuth = vi.fn(() => ({ auth: 'mock-auth' }));
const mockFirestore = vi.fn(() => ({ firestore: 'mock-firestore' }));

const mockAdmin = {
  apps: [] as unknown[],
  app: mockGetApp,
  initializeApp: mockInitializeApp,
  credential: { cert: mockCert, applicationDefault: mockApplicationDefault },
  auth: mockAuth,
  firestore: mockFirestore,
};

vi.mock('firebase-admin', () => ({
  default: mockAdmin,
}));

const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock('node:fs', () => ({
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  default: {
    existsSync: (...args: unknown[]) => mockExistsSync(...args),
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
}));

vi.mock('node:path', () => ({
  resolve: vi.fn(() => '/mocked/path/serviceAccountKey.json'),
  default: {
    resolve: vi.fn(() => '/mocked/path/serviceAccountKey.json'),
  },
}));

const setNodeEnv = (value: string | undefined) => {
  (process.env as Record<string, string | undefined>).NODE_ENV = value;
};

describe('firebase-admin initFirebaseAdmin', () => {
  let savedServiceAccountKey: string | undefined;
  let savedNodeEnv: string | undefined;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockAdmin.apps = [];
    savedServiceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    savedNodeEnv = process.env.NODE_ENV;
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    setNodeEnv('test');
    mockExistsSync.mockReturnValue(false);
  });

  afterEach(() => {
    if (savedServiceAccountKey !== undefined) {
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY = savedServiceAccountKey;
    } else {
      delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    }
    setNodeEnv(savedNodeEnv);
  });

  it('should return existing app when admin is already initialized', async () => {
    mockAdmin.apps = [mockApp];
    await import('./firebase-admin');
    expect(mockGetApp).toHaveBeenCalled();
    expect(mockInitializeApp).not.toHaveBeenCalled();
  });

  it('should initialize with FIREBASE_SERVICE_ACCOUNT_KEY env var when valid', async () => {
    const serviceAccount = {
      type: 'service_account',
      project_id: 'test-project',
    };
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify(serviceAccount);
    await import('./firebase-admin');
    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential: expect.anything(),
    });
    expect(mockCert).toHaveBeenCalledWith(serviceAccount);
  });

  it('should throw when FIREBASE_SERVICE_ACCOUNT_KEY contains invalid JSON', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY = 'not-valid-json{{{';
    await expect(import('./firebase-admin')).rejects.toThrow(
      'FIREBASE_SERVICE_ACCOUNT_KEY contains invalid JSON'
    );
  });

  it('should initialize from serviceAccountKey.json when file exists', async () => {
    const serviceAccount = {
      type: 'service_account',
      project_id: 'file-project',
    };
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(serviceAccount));
    await import('./firebase-admin');
    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential: expect.anything(),
    });
    expect(mockCert).toHaveBeenCalledWith(serviceAccount);
  });

  it('should throw when serviceAccountKey.json contains invalid JSON', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('invalid-json---');
    await expect(import('./firebase-admin')).rejects.toThrow(
      'serviceAccountKey.json contains invalid JSON'
    );
  });

  it('should throw in production when no credentials are available', async () => {
    setNodeEnv('production');
    await expect(import('./firebase-admin')).rejects.toThrow(
      'FIREBASE_SERVICE_ACCOUNT_KEY is required in production'
    );
  });

  it('should use applicationDefault when not in production and no credentials', async () => {
    setNodeEnv('development');
    await import('./firebase-admin');
    expect(mockInitializeApp).toHaveBeenCalledWith({
      credential: 'applicationDefault',
    });
    expect(mockApplicationDefault).toHaveBeenCalled();
  });

  it('should export adminAuth and adminDb', async () => {
    const mod = await import('./firebase-admin');
    expect(mod.adminAuth).toBeDefined();
    expect(mod.adminDb).toBeDefined();
  });
});
