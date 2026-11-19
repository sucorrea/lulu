import { describe, expect, it } from 'vitest';

import {
  filterNavByRole,
  isCurrentRoute,
  MOBILE_PRIMARY_NAV,
  MORE_NAV_ITEMS,
  NAV_ITEMS,
} from './nav-config';

describe('nav-config', () => {
  describe('NAV_ITEMS', () => {
    it('should list desktop items in order', () => {
      expect(NAV_ITEMS.map((i) => i.label)).toEqual([
        'Lulus',
        'Agenda',
        'Galeria',
        'Histórico',
        'Auditoria',
        'Sobre',
        'Sorteio',
      ]);
      expect(NAV_ITEMS.map((i) => i.href)).toEqual([
        '/',
        '/dashboard',
        '/galeria',
        '/historico',
        '/auditoria',
        '/sobre',
        '/sorteio',
      ]);
    });

    it('should mark only Sorteio as adminOnly', () => {
      expect(NAV_ITEMS.filter((i) => i.adminOnly).map((i) => i.label)).toEqual([
        'Sorteio',
      ]);
    });

    it('should not have shortLabel on any item', () => {
      [...NAV_ITEMS, ...MOBILE_PRIMARY_NAV, ...MORE_NAV_ITEMS].forEach((i) => {
        expect(i).not.toHaveProperty('shortLabel');
      });
    });
  });

  describe('MOBILE_PRIMARY_NAV', () => {
    it('should have the four primary items', () => {
      expect(MOBILE_PRIMARY_NAV.map((i) => i.label)).toEqual([
        'Lulus',
        'Agenda',
        'Galeria',
        'Histórico',
      ]);
    });
  });

  describe('filterNavByRole', () => {
    it('should hide admin items for non admin', () => {
      expect(
        filterNavByRole(MORE_NAV_ITEMS, false).map((i) => i.label)
      ).toEqual(['Auditoria', 'Sobre']);
    });

    it('should include Sorteio last for admin', () => {
      const labels = filterNavByRole(MORE_NAV_ITEMS, true).map((i) => i.label);
      expect(labels[labels.length - 1]).toBe('Sorteio');
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
