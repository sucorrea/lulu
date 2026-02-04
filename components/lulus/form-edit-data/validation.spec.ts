import { describe, it, expect } from 'vitest';
import { personSchema } from './validation';

describe('personSchema validation', () => {
  const validData = {
    fullName: 'John Doe',
    date: '1990-05-15',
    email: 'john@example.com',
    phone: '1234567890',
    instagram: 'johndoe',
    pix_key_type: 'email' as const,
    pix_key: 'john@pix.com',
  };

  describe('fullName validation', () => {
    it('should accept valid fullName', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty fullName', () => {
      const result = personSchema.safeParse({ ...validData, fullName: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'Nome completo é obrigatório'
        );
      }
    });

    it('should reject fullName longer than 80 characters', () => {
      const longName = 'a'.repeat(81);
      const result = personSchema.safeParse({
        ...validData,
        fullName: longName,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Máximo de 80 caracteres');
      }
    });

    it('should accept fullName with 80 characters', () => {
      const maxName = 'a'.repeat(80);
      const result = personSchema.safeParse({
        ...validData,
        fullName: maxName,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('date validation', () => {
    it('should accept valid date', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty date', () => {
      const result = personSchema.safeParse({ ...validData, date: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Data é obrigatória');
      }
    });

    it('should accept different date formats', () => {
      const result = personSchema.safeParse({
        ...validData,
        date: '2000-12-31',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = personSchema.safeParse({
        ...validData,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido');
      }
    });

    it('should accept undefined email', () => {
      const result = personSchema.safeParse({
        ...validData,
        email: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should accept different valid email formats', () => {
      const emails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];

      emails.forEach((email) => {
        const result = personSchema.safeParse({ ...validData, email });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('phone validation', () => {
    it('should accept valid phone', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept undefined phone', () => {
      const result = personSchema.safeParse({
        ...validData,
        phone: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should accept various phone formats', () => {
      const phones = ['1234567890', '(11) 98765-4321', '+55 11 98765-4321'];

      phones.forEach((phone) => {
        const result = personSchema.safeParse({ ...validData, phone });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('instagram validation', () => {
    it('should accept valid instagram', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept undefined instagram', () => {
      const result = personSchema.safeParse({
        ...validData,
        instagram: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should accept various instagram usernames', () => {
      const usernames = ['username', 'user.name', 'user_name', 'user123'];

      usernames.forEach((instagram) => {
        const result = personSchema.safeParse({ ...validData, instagram });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('pix_key_type validation', () => {
    it('should accept all valid pix_key_types', () => {
      const types = ['cpf', 'email', 'phone', 'random', 'none'] as const;

      types.forEach((pix_key_type) => {
        const result = personSchema.safeParse({ ...validData, pix_key_type });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid pix_key_type', () => {
      const result = personSchema.safeParse({
        ...validData,
        pix_key_type: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('pix_key validation', () => {
    it('should accept valid pix_key', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept undefined pix_key', () => {
      const result = personSchema.safeParse({
        ...validData,
        pix_key: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should accept various pix_key formats', () => {
      const keys = [
        '123.456.789-00',
        'pix@example.com',
        '11987654321',
        'random-key-123',
      ];

      keys.forEach((pix_key) => {
        const result = personSchema.safeParse({ ...validData, pix_key });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('complete object validation', () => {
    it('should accept minimal required fields', () => {
      const minimalData = {
        fullName: 'John Doe',
        date: '1990-05-15',
        pix_key_type: 'none' as const,
      };

      const result = personSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should accept all fields populated', () => {
      const result = personSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when required fields are missing', () => {
      const result = personSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });
});
