import { describe, it, expect } from 'vitest';
import { calculateDiff, hasChanges, describeChanges } from './diffCalculator';
import type { Person } from '@/components/lulus/types';

describe('diffCalculator', () => {
  describe('calculateDiff', () => {
    const basePerson: Partial<Person> = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '11999887766',
      instagram: 'joaosilva',
      pix_key: '12345678900',
      pix_key_type: 'cpf',
      city: 'São Paulo',
    };

    it('should detect simple field changes', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        email: 'joao.novo@example.com',
      };

      const changes = calculateDiff(basePerson, newData);

      expect(changes).toHaveLength(1);
      expect(changes[0]).toEqual({
        field: 'email',
        oldValue: 'joao@example.com',
        newValue: 'joao.novo@example.com',
        fieldType: 'string',
      });
    });

    it('should detect multiple field changes', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        email: 'joao.novo@example.com',
        phone: '21988776655',
        pix_key: '98765432100',
      };

      const changes = calculateDiff(basePerson, newData);

      expect(changes).toHaveLength(3);
      expect(changes.some((c) => c.field === 'email')).toBe(true);
      expect(changes.some((c) => c.field === 'phone')).toBe(true);
      expect(changes.some((c) => c.field === 'pix_key')).toBe(true);
    });

    it('should detect null value changes', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        instagram: null!,
      };

      const changes = calculateDiff(basePerson, newData);

      const instagramChange = changes.find((c) => c.field === 'instagram');
      expect(instagramChange).toEqual({
        field: 'instagram',
        oldValue: 'joaosilva',
        newValue: null,
        fieldType: 'string',
      });
    });

    it('should treat undefined as null', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        instagram: undefined,
      };

      const changes = calculateDiff(basePerson, newData);

      const instagramChange = changes.find((c) => c.field === 'instagram');
      expect(instagramChange?.newValue).toBeNull();
    });

    it('should treat empty string as null', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        instagram: '',
      };

      const changes = calculateDiff(basePerson, newData);

      const instagramChange = changes.find((c) => c.field === 'instagram');
      expect(instagramChange?.newValue).toBeNull();
    });

    it('should ignore excluded fields (id, month, gives_to, photoUpdatedAt)', () => {
      const newData: Partial<Person> = {
        ...basePerson,
        id: 999,
        month: 'Janeiro',
        email: 'novo@example.com',
      };

      const changes = calculateDiff(basePerson, newData);

      expect(changes.some((c) => c.field === 'id')).toBe(false);
      expect(changes.some((c) => c.field === 'month')).toBe(false);
      expect(changes.some((c) => c.field === 'email')).toBe(true);
    });

    it('should only track fields present in newData (ignore missing fields)', () => {
      const oldData: Partial<Person> = {
        name: 'João Silva',
        email: 'joao@example.com',
        instagram: 'joaosilva',
        phone: '11999887766',
      };

      const newData: Partial<Person> = {
        name: 'João Silva',
        email: 'joao@example.com',
      };

      const changes = calculateDiff(oldData, newData);

      // Fields not in newData should be ignored (not treated as cleared)
      const instagramChange = changes.find((c) => c.field === 'instagram');
      expect(instagramChange).toBeUndefined();

      const phoneChange = changes.find((c) => c.field === 'phone');
      expect(phoneChange).toBeUndefined();

      // No changes since name and email are identical
      expect(changes).toHaveLength(0);
    });

    it('should handle null oldData gracefully', () => {
      const newData: Partial<Person> = {
        name: 'Maria Silva',
        email: 'maria@example.com',
      };

      const changes = calculateDiff(null, newData);

      expect(changes.length).toBeGreaterThan(0);
      expect(changes.some((c) => c.field === 'name')).toBe(true);
      expect(changes.some((c) => c.field === 'email')).toBe(true);
    });

    it('should handle undefined oldData gracefully', () => {
      const newData: Partial<Person> = {
        name: 'Maria Silva',
      };

      const changes = calculateDiff(undefined, newData);

      expect(changes.some((c) => c.field === 'name')).toBe(true);
    });

    it('should not detect changes when data is identical', () => {
      const newData: Partial<Person> = { ...basePerson };

      const changes = calculateDiff(basePerson, newData);

      expect(changes).toHaveLength(0);
    });

    it('should handle date field changes', () => {
      const oldData: Partial<Person> = {
        ...basePerson,
        date: '1990-01-15T00:00:00.000Z',
      };
      const newData: Partial<Person> = {
        ...basePerson,
        date: '1990-02-20T00:00:00.000Z',
      };

      const changes = calculateDiff(oldData, newData);

      const dateChange = changes.find((c) => c.field === 'date');
      expect(dateChange).toBeDefined();
      expect(dateChange?.fieldType).toBe('date');
      expect(dateChange?.oldValue).not.toBe(dateChange?.newValue);
    });

    it('should handle number field changes (gives_to_id)', () => {
      const oldData: Partial<Person> = {
        ...basePerson,
        gives_to_id: 1,
      };
      const newData: Partial<Person> = {
        ...basePerson,
        gives_to_id: 2,
      };

      const changes = calculateDiff(oldData, newData);

      const giftChange = changes.find((c) => c.field === 'gives_to_id');
      expect(giftChange).toEqual({
        field: 'gives_to_id',
        oldValue: 1,
        newValue: 2,
        fieldType: 'number',
      });
    });

    it('should explicitly detect when a field is cleared (set to null/undefined)', () => {
      const oldData: Partial<Person> = {
        name: 'João',
        instagram: 'joaosilva',
      };
      const newData: Partial<Person> = {
        name: 'João',
        instagram: null!,
      };

      const changes = calculateDiff(oldData, newData);

      const instagramChange = changes.find((c) => c.field === 'instagram');
      expect(instagramChange).toBeDefined();
      expect(instagramChange?.oldValue).toBe('joaosilva');
      expect(instagramChange?.newValue).toBeNull();
    });

    it('should only track fields defined in TRACKED_FIELDS', () => {
      const oldData: Partial<Person> = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11999887766',
        instagram: 'joaosilva',
        pix_key: '12345678900',
        pix_key_type: 'cpf',
        city: 'São Paulo',
        gives_to_id: 1,
        fullName: 'João Silva Santos',
      };

      const newData: Partial<Person> = {
        name: 'João Silva Jr',
        email: 'joao.jr@example.com',
        phone: '11999887766',
        instagram: 'joaosilva',
        pix_key: '12345678900',
        pix_key_type: 'cpf',
        city: 'Rio de Janeiro',
        gives_to_id: 2,
        fullName: 'João Silva Santos Jr',
      };

      const changes = calculateDiff(oldData, newData);

      expect(changes).toHaveLength(5);
      expect(changes.some((c) => c.field === 'name')).toBe(true);
      expect(changes.some((c) => c.field === 'email')).toBe(true);
      expect(changes.some((c) => c.field === 'city')).toBe(true);
      expect(changes.some((c) => c.field === 'gives_to_id')).toBe(true);
      expect(changes.some((c) => c.field === 'fullName')).toBe(true);
      expect(changes.some((c) => c.field === 'phone')).toBe(false);
      expect(changes.some((c) => c.field === 'instagram')).toBe(false);
      expect(changes.some((c) => c.field === 'pix_key')).toBe(false);
      expect(changes.some((c) => c.field === 'pix_key_type')).toBe(false);
    });

    it('should normalize Date objects and ISO strings consistently', () => {
      const oldData: Partial<Person> = {
        name: 'João',
        date: new Date('1990-01-15T00:00:00.000Z'),
      };
      const newData: Partial<Person> = {
        name: 'João',
        date: '1990-01-15T00:00:00.000Z',
      };

      const changes = calculateDiff(oldData, newData);

      expect(changes.some((c) => c.field === 'date')).toBe(false);
    });

    it('should only record actual changes', () => {
      const oldData: Partial<Person> = {
        name: 'João',
        email: 'joao@example.com',
        phone: '11999887766',
        instagram: 'joao_ig',
        city: 'São Paulo',
      };

      const newData: Partial<Person> = {
        name: 'João',
        email: 'joao@example.com',
        phone: '11999887766',
        instagram: 'joao_ig',
        city: 'São Paulo',
      };

      const changes = calculateDiff(oldData, newData);

      expect(changes).toHaveLength(0);
    });

    it('should not generate false positives for partial updates (form submission scenario)', () => {
      // Simulate full Firestore document
      const currentData: Partial<Person> = {
        id: 1,
        name: 'João',
        fullName: 'João Silva',
        date: '1990-01-15',
        city: 'São Paulo',
        email: 'joao@example.com',
        phone: '11999887766',
        instagram: 'joaosilva',
        pix_key: '12345678900',
        pix_key_type: 'cpf',
        gives_to_id: 2,
        picture: 'https://example.com/photo.jpg',
        photoURL: 'https://example.com/photo.jpg',
      };

      // Simulate partial form submission (only form fields)
      const updatedData: Partial<Person> = {
        fullName: 'João Silva Santos',
        date: '1990-01-15',
        email: 'joao.novo@example.com',
        phone: '11999887766',
        instagram: 'joaosilva',
        pix_key: '12345678900',
        pix_key_type: 'cpf',
      };

      const changes = calculateDiff(currentData, updatedData);

      // Should only detect the actual changes (fullName and email)
      expect(changes).toHaveLength(2);
      expect(changes.some((c) => c.field === 'fullName')).toBe(true);
      expect(changes.some((c) => c.field === 'email')).toBe(true);

      // Should NOT report false positives for fields absent from updatedData
      expect(changes.some((c) => c.field === 'name')).toBe(false);
      expect(changes.some((c) => c.field === 'city')).toBe(false);
      expect(changes.some((c) => c.field === 'gives_to_id')).toBe(false);
      expect(changes.some((c) => c.field === 'picture')).toBe(false);
      expect(changes.some((c) => c.field === 'photoURL')).toBe(false);
    });
  });

  describe('hasChanges', () => {
    it('should return true when there are changes', () => {
      const changes = [
        {
          field: 'email',
          oldValue: 'old@example.com',
          newValue: 'new@example.com',
          fieldType: 'string' as const,
        },
      ];

      expect(hasChanges(changes)).toBe(true);
    });

    it('should return false when no changes', () => {
      expect(hasChanges([])).toBe(false);
    });
  });

  describe('describeChanges', () => {
    it('should describe changes in readable format', () => {
      const changes = [
        {
          field: 'email',
          oldValue: 'old@example.com',
          newValue: 'new@example.com',
          fieldType: 'string' as const,
        },
        {
          field: 'phone',
          oldValue: null,
          newValue: '11999887766',
          fieldType: 'string' as const,
        },
      ];

      const description = describeChanges(changes);

      expect(description).toContain('email');
      expect(description).toContain('old@example.com');
      expect(description).toContain('new@example.com');
      expect(description).toContain('phone');
      expect(description).toContain('(vazio)');
    });

    it('should describe no changes', () => {
      const description = describeChanges([]);

      expect(description).toBe('Nenhuma mudança detectada');
    });

    it('should handle object values without [object Object]', () => {
      const changes = [
        {
          field: 'metadata',
          oldValue: { key: 'oldValue', count: 1 },
          newValue: { key: 'newValue', count: 2 },
          fieldType: 'object' as const,
        },
      ];

      const description = describeChanges(changes);

      expect(description).not.toContain('[object Object]');
      expect(description).toContain('metadata');
      expect(description).toContain('oldValue');
      expect(description).toContain('newValue');
    });

    it('should handle array values correctly', () => {
      const changes = [
        {
          field: 'tags',
          oldValue: ['tag1', 'tag2'],
          newValue: ['tag3', 'tag4'],
          fieldType: 'array' as const,
        },
      ];

      const description = describeChanges(changes);

      expect(description).not.toContain('[object Object]');
      expect(description).toContain('tags');
      expect(description).toContain('tag1');
      expect(description).toContain('tag3');
    });

    it('should handle mixed types in changes', () => {
      const changes = [
        {
          field: 'name',
          oldValue: 'João',
          newValue: 'João Silva',
          fieldType: 'string' as const,
        },
        {
          field: 'age',
          oldValue: 25,
          newValue: 26,
          fieldType: 'number' as const,
        },
        {
          field: 'settings',
          oldValue: { theme: 'dark' },
          newValue: { theme: 'light' },
          fieldType: 'object' as const,
        },
      ];

      const description = describeChanges(changes);

      expect(description).toContain('name: João → João Silva');
      expect(description).toContain('age: 25 → 26');
      expect(description).toContain('settings');
      expect(description).toContain('dark');
      expect(description).toContain('light');
      expect(description).not.toContain('[object Object]');
    });
  });
});
