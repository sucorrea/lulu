import { describe, it, expect } from 'vitest';
import { meses } from './months';

describe('months', () => {
  describe('meses', () => {
    it('should have 12 months', () => {
      expect(meses).toHaveLength(12);
    });

    it('should have correct structure', () => {
      expect(meses[0]).toHaveProperty('value');
      expect(meses[0]).toHaveProperty('label');
      expect(meses[0].value).toBe('01');
      expect(meses[0].label).toBe('Janeiro');
    });

    it('should have all months in order', () => {
      expect(meses[11].label).toBe('Dezembro');
      expect(meses[11].value).toBe('12');
    });
  });
});
