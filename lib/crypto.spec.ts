import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('crypto', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY = '0'.repeat(64);
    vi.resetModules();
  });

  const load = async () => {
    const mod = await import('./crypto');
    return mod;
  };

  it('encryptId/decryptId round-trip', async () => {
    const { encryptId, decryptId } = await load();
    const id = 'user-123';
    const token = encryptId(id);
    expect(decryptId(token)).toBe(id);
  });

  it('encryptId produces url-safe token', async () => {
    const { encryptId } = await load();
    const token = encryptId('abc');
    expect(token).not.toMatch(/[+/=]/);
  });

  it('encryptId is non-deterministic for same input', async () => {
    const { encryptId } = await load();
    const id = 'same';
    const a = encryptId(id);
    const b = encryptId(id);
    expect(a).not.toBe(b);
  });

  it('decryptId throws on tampered token', async () => {
    const { encryptId, decryptId } = await load();
    const token = encryptId('x');
    const mid = Math.floor(token.length / 2);
    const tampered =
      token.slice(0, mid) +
      (token[mid] === 'A' ? 'Z' : 'A') +
      token.slice(mid + 1);
    expect(() => decryptId(tampered)).toThrow();
  });

  it('decryptId throws with wrong key', async () => {
    const { encryptId } = await load();
    const token = encryptId('secret');

    process.env.NEXT_PUBLIC_ENCRYPTION_KEY = '1'.repeat(64);
    vi.resetModules();
    const { decryptId } = await import('./crypto');

    expect(() => decryptId(token)).toThrow();
  });
});
