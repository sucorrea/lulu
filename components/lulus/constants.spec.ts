import { describe, expect, it } from 'vitest';
import {
  LINK_INSTAGRAM,
  LINK_HOROSCOPO_DIARIO,
  LINK_WHATSAPP,
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

  describe('LINK_WHATSAPP', () => {
    it('should have correct WhatsApp API link', () => {
      expect(LINK_WHATSAPP).toBe('https://api.whatsapp.com/send?phone=55');
    });

    it('should include country code 55', () => {
      expect(LINK_WHATSAPP).toContain('55');
    });
  });
});
