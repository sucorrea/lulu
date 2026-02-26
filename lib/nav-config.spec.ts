import { describe, expect, it } from 'vitest';

import { isCurrentRoute, NAV_ITEMS } from './nav-config';

describe('nav-config', () => {
  describe('NAV_ITEMS', () => {
    it('should have 6 navigation items', () => {
      expect(NAV_ITEMS).toHaveLength(6);
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
      expect(hrefs).toContain('/sobre');
    });

    it('should have shortLabel for items that need abbreviated labels on smaller screens', () => {
      const participantes = NAV_ITEMS.find((i) => i.href === '/');
      expect(participantes?.shortLabel).toBe('Particip.');

      const dashboard = NAV_ITEMS.find((i) => i.href === '/dashboard');
      expect(dashboard?.shortLabel).toBe('Dash.');

      const historico = NAV_ITEMS.find((i) => i.href === '/historico');
      expect(historico?.shortLabel).toBe('Hist.');

      const auditoria = NAV_ITEMS.find((i) => i.href === '/auditoria');
      expect(auditoria?.shortLabel).toBe('Audit.');
    });

    it('should allow shortLabel to be optional for items with short labels', () => {
      const galeria = NAV_ITEMS.find((i) => i.href === '/galeria');
      const sobre = NAV_ITEMS.find((i) => i.href === '/sobre');

      expect(galeria?.label).toBe('Galeria');
      expect(sobre?.label).toBe('Sobre');
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
