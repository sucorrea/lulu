import { describe, expect, it } from 'vitest';
import {
  LINK_INSTAGRAM,
  LINK_HOROSCOPO_DIARIO,
  LINK_LULU,
  LINK_WHATSAPP,
  months,
  COLORS,
} from './constants';

describe('constants', () => {
  describe('LINK_INSTAGRAM', () => {
    it('should have correct Instagram link', () => {
      expect(LINK_INSTAGRAM).toBe('https://instagram.com/');
    });

    it('should be a non-empty string', () => {
      expect(LINK_INSTAGRAM).toBeTruthy();
      expect(typeof LINK_INSTAGRAM).toBe('string');
    });
  });

  describe('LINK_HOROSCOPO_DIARIO', () => {
    it('should have correct horoscope link', () => {
      expect(LINK_HOROSCOPO_DIARIO).toBe(
        'https://joaobidu.com.br/horoscopo-do-dia/horoscopo-do-dia-para-'
      );
    });

    it('should be a non-empty string', () => {
      expect(LINK_HOROSCOPO_DIARIO).toBeTruthy();
      expect(typeof LINK_HOROSCOPO_DIARIO).toBe('string');
    });
  });

  describe('LINK_LULU', () => {
    it('should have correct Lulu image link', () => {
      expect(LINK_LULU).toContain('supabase.co');
      expect(LINK_LULU).toContain('faLulu.jpg');
    });

    it('should be a valid URL', () => {
      expect(() => new URL(LINK_LULU)).not.toThrow();
    });
  });

  describe('LINK_WHATSAPP', () => {
    it('should have correct WhatsApp API link', () => {
      expect(LINK_WHATSAPP).toBe('https://api.whatsapp.com/send?phone=55');
    });

    it('should include country code 55', () => {
      expect(LINK_WHATSAPP).toContain('55');
    });
  });

  describe('months', () => {
    it('should have 12 months', () => {
      expect(months).toHaveLength(12);
    });

    it('should have all months in correct order', () => {
      const expectedMonths = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      expect(months).toEqual(expectedMonths);
    });

    it('should have all month names as strings', () => {
      months.forEach((month) => {
        expect(typeof month).toBe('string');
        expect(month.length).toBeGreaterThan(0);
      });
    });
  });

  describe('COLORS', () => {
    it('should have at least one color', () => {
      expect(COLORS.length).toBeGreaterThan(0);
    });

    it('should have valid hex colors', () => {
      COLORS.forEach((color) => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have expected colors', () => {
      expect(COLORS).toContain('#0088FE');
      expect(COLORS).toContain('#00C49F');
      expect(COLORS).toContain('#FFBB28');
      expect(COLORS).toContain('#FF8042');
    });
  });
});
