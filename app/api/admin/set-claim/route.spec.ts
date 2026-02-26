import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockVerifyIdToken = vi.fn();
const mockGetUser = vi.fn();
const mockSetCustomUserClaims = vi.fn();

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: (...args: unknown[]) => mockVerifyIdToken(...args),
    getUser: (...args: unknown[]) => mockGetUser(...args),
    setCustomUserClaims: (...args: unknown[]) =>
      mockSetCustomUserClaims(...args),
  },
}));

import { POST } from './route';

const createRequest = (options: { auth?: string; body?: object }) => {
  const { auth, body } = options;
  const headers: Record<string, string> = {};
  if (auth) {
    headers['authorization'] = auth;
  }

  return new NextRequest('http://localhost/api/admin/set-claim', {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
};

describe('POST /api/admin/set-claim', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetCustomUserClaims.mockResolvedValue(undefined);
  });

  it('returns 401 when authorization header is missing', async () => {
    const req = createRequest({ body: { targetUid: 'uid1' } });
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Não autorizado' });
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('returns 401 when authorization does not start with Bearer ', async () => {
    const req = createRequest({
      auth: 'Basic token',
      body: { targetUid: 'uid1' },
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Não autorizado' });
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid or expired', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Token expired'));

    const req = createRequest({
      auth: 'Bearer invalid-token',
      body: { targetUid: 'uid1' },
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: 'Token inválido ou expirado',
    });
  });

  it('returns 403 when admin tries to revoke their own access', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser.mockResolvedValueOnce({
      uid: 'admin1',
      customClaims: { admin: true },
    });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'admin1', admin: false },
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error:
        'Não é possível revogar seu próprio acesso admin. Peça a outro administrador.',
    });
    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });

  it('returns 403 when caller is not admin', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: false });
    mockGetUser.mockResolvedValueOnce({
      uid: 'admin1',
      customClaims: { admin: false },
    });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'uid1' },
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: 'Apenas administradores podem alterar o acesso admin',
    });
    expect(mockGetUser).toHaveBeenCalledWith('admin1');
  });

  it('returns 403 when caller has stale token (admin revoked but token not expired)', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'demoted1', admin: true });
    mockGetUser.mockResolvedValueOnce({
      uid: 'demoted1',
      customClaims: { admin: false },
    });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'demoted1', admin: true },
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: 'Apenas administradores podem alterar o acesso admin',
    });
  });

  it('returns 400 when targetUid is missing', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser.mockResolvedValueOnce({
      uid: 'admin1',
      customClaims: { admin: true },
    });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: {},
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'targetUid é obrigatório',
    });
  });

  it('returns 400 when targetUid is empty string', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser.mockResolvedValueOnce({
      uid: 'admin1',
      customClaims: { admin: true },
    });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: '' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'targetUid é obrigatório',
    });
  });

  it('returns 404 when target user does not exist', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockRejectedValueOnce(new Error('User not found'));

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'nonexistent-uid' },
    });
    const res = await POST(req);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: "Usuário com UID 'nonexistent-uid' não encontrado",
    });
  });

  it('grants admin successfully when admin is true or omitted', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockResolvedValueOnce({
        uid: 'target1',
        customClaims: {},
      });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'target1', admin: true },
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      uid: 'target1',
      admin: true,
    });
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith('target1', {
      admin: true,
    });
  });

  it('grants admin when admin is omitted (default true)', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockResolvedValueOnce({
        uid: 'target2',
        customClaims: {},
      });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'target2' },
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      uid: 'target2',
      admin: true,
    });
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith('target2', {
      admin: true,
    });
  });

  it('revokes admin when admin is false', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockResolvedValueOnce({
        uid: 'target3',
        customClaims: { admin: true, other: 'claim' },
      });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'target3', admin: false },
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      uid: 'target3',
      admin: false,
    });
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith('target3', {
      admin: false,
      other: 'claim',
    });
  });

  it('preserves existing claims when granting admin', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockResolvedValueOnce({
        uid: 'target4',
        customClaims: { role: 'editor' },
      });

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'target4', admin: true },
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockSetCustomUserClaims).toHaveBeenCalledWith('target4', {
      admin: true,
      role: 'editor',
    });
  });

  it('returns 500 when setCustomUserClaims throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockVerifyIdToken.mockResolvedValue({ uid: 'admin1', admin: true });
    mockGetUser
      .mockResolvedValueOnce({
        uid: 'admin1',
        customClaims: { admin: true },
      })
      .mockResolvedValueOnce({
        uid: 'target5',
        customClaims: {},
      });
    mockSetCustomUserClaims.mockRejectedValue(new Error('Firebase error'));

    const req = createRequest({
      auth: 'Bearer valid-token',
      body: { targetUid: 'target5' },
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: 'Erro interno ao processar requisição',
    });
    consoleSpy.mockRestore();
  });
});
