import { describe, expect, it } from 'vitest';

import { isCurrentRoute, NAV_ITEMS } from './nav-config';

describe('nav-config', () => {
  describe('NAV_ITEMS', () => {
    it('should have 5 navigation items', () => {
      expect(NAV_ITEMS).toHaveLength(5);
    });

    it('should have correct structure for each item', () => {
      NAV_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('icon');
        expect(typeof item.href).toBe('string');
        expect(typeof item.label).toBe('string');
        expect(item.icon).toBeDefined();
      });
    });

    it('should include all main routes', () => {
      const hrefs = NAV_ITEMS.map((i) => i.href);
      expect(hrefs).toContain('/');
      expect(hrefs).toContain('/dashboard');
      expect(hrefs).toContain('/galeria');
      expect(hrefs).toContain('/auditoria');
      expect(hrefs).toContain('/historico');
    });
  });

  describe('isCurrentRoute', () => {
    it('should return true for exact root match', () => {
      expect(isCurrentRoute('/', '/')).toBe(true);
    });

    it('should return false when pathname is not root', () => {
      expect(isCurrentRoute('/dashboard', '/')).toBe(false);
    });

    it('should return true for exact route match', () => {
      expect(isCurrentRoute('/dashboard', '/dashboard')).toBe(true);
    });

    it('should return true for nested path', () => {
      expect(isCurrentRoute('/dashboard/users', '/dashboard')).toBe(true);
    });

    it('should return false for different route', () => {
      expect(isCurrentRoute('/galeria', '/dashboard')).toBe(false);
    });
  });
});
