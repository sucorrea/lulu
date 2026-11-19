import { describe, it, expect } from 'vitest';
import { NameKey } from './pix-key-labels';

describe('pix-key-labels', () => {
  describe('NameKey', () => {
    it('should have correct mappings', () => {
      expect(NameKey.cpf).toBe('CPF');
      expect(NameKey.email).toBe('Email');
      expect(NameKey.phone).toBe('Celular');
      expect(NameKey.random).toBe('Aleatório');
      expect(NameKey.none).toBe('Nenhum');
    });
  });
});
