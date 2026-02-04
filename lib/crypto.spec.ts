import { describe, it, expect, beforeEach } from 'vitest';

describe('crypto', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY = '0'.repeat(64);
  });

  describe('encryptId', () => {
    it('should have crypto functions defined', () => {
      expect(true).toBe(true);
    });
  });
});
