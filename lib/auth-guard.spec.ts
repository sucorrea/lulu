import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  getIdTokenResult: vi.fn(),
}));

vi.mock('@/services/firebase', () => ({
  auth: { currentUser: null as unknown },
}));

import { getIdTokenResult } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { assertAdmin } from './auth-guard';

describe('assertAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(auth, 'currentUser', {
      value: null,
      writable: true,
      configurable: true,
    });
  });

  it('throws when user is not authenticated', async () => {
    await expect(assertAdmin()).rejects.toThrow('Usuário não autenticado');
    expect(getIdTokenResult).not.toHaveBeenCalled();
  });

  it('throws when authenticated user is not admin', async () => {
    const user = { uid: 'u1' };
    Object.defineProperty(auth, 'currentUser', {
      value: user,
      writable: true,
      configurable: true,
    });

    vi.mocked(getIdTokenResult).mockResolvedValue({
      claims: { admin: false },
    } as any);

    await expect(assertAdmin()).rejects.toThrow(
      'Acesso restrito a administradores'
    );
    expect(getIdTokenResult).toHaveBeenCalledWith(user, true);
  });

  it('resolves when authenticated user is admin', async () => {
    const user = { uid: 'u2' };
    Object.defineProperty(auth, 'currentUser', {
      value: user,
      writable: true,
      configurable: true,
    });

    vi.mocked(getIdTokenResult).mockResolvedValue({
      claims: { admin: true },
    } as any);

    await expect(assertAdmin()).resolves.toBeUndefined();
    expect(getIdTokenResult).toHaveBeenCalledWith(user, true);
  });
});
