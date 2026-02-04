import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('should handle Tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle objects', () => {
      expect(cn({ class1: true, class2: false })).toBe('class1');
    });

    it('should handle undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });
  });
});
