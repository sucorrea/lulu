import { describe, it, expect } from 'vitest';
import { defaultValuesPerson } from './utils';
import { Person } from '../types';

describe('form-edit-data utils', () => {
  const mockPerson: Person = {
    id: 1,
    name: 'Test Person',
    fullName: 'Test Person Full Name',
    date: new Date('1990-05-15'),
    month: '05',
    receives_to_id: 2,
    city: 'Test City',
    email: 'test@example.com',
    phone: '1234567890',
    instagram: 'testuser',
    pix_key_type: 'email',
    pix_key: 'test@pix.com',
  };

  describe('defaultValuesPerson', () => {
    it('should return default values with all fields populated', () => {
      const result = defaultValuesPerson(mockPerson);

      expect(result).toEqual({
        fullName: 'Test Person Full Name',
        date: '1990-05-15',
        email: 'test@example.com',
        phone: '1234567890',
        instagram: 'testuser',
        pix_key_type: 'email',
        pix_key: 'test@pix.com',
      });
    });

    it('should handle undefined optional fields', () => {
      const personWithoutOptionals: Person = {
        ...mockPerson,
        email: undefined,
        phone: undefined,
        instagram: undefined,
        pix_key_type: undefined,
        pix_key: undefined,
      };

      const result = defaultValuesPerson(personWithoutOptionals);

      expect(result).toEqual({
        fullName: 'Test Person Full Name',
        date: '1990-05-15',
        email: '',
        phone: '',
        instagram: '',
        pix_key_type: 'none',
        pix_key: '',
      });
    });

    it('should format date correctly', () => {
      const result = defaultValuesPerson(mockPerson);

      expect(result.date).toBe('1990-05-15');
    });

    it('should handle date as string', () => {
      const personWithStringDate = {
        ...mockPerson,
        date: '1990-05-15T00:00:00.000Z',
      };

      const result = defaultValuesPerson(personWithStringDate);

      expect(result.date).toBe('1990-05-15');
    });

    it('should handle empty fullName', () => {
      const personWithoutFullName = {
        ...mockPerson,
        fullName: '',
      };

      const result = defaultValuesPerson(personWithoutFullName);

      expect(result.fullName).toBe('');
    });

    it('should handle all pix_key_type options', () => {
      const pixTypes: Array<'cpf' | 'email' | 'phone' | 'random' | 'none'> = [
        'cpf',
        'email',
        'phone',
        'random',
        'none',
      ];

      pixTypes.forEach((type) => {
        const person = { ...mockPerson, pix_key_type: type };
        const result = defaultValuesPerson(person);
        expect(result.pix_key_type).toBe(type);
      });
    });

    it('should handle empty pix_key', () => {
      const personWithoutPixKey = {
        ...mockPerson,
        pix_key: undefined,
      };

      const result = defaultValuesPerson(personWithoutPixKey);

      expect(result.pix_key).toBe('');
    });

    it('should preserve all provided values', () => {
      const result = defaultValuesPerson(mockPerson);

      expect(result.email).toBe(mockPerson.email);
      expect(result.phone).toBe(mockPerson.phone);
      expect(result.instagram).toBe(mockPerson.instagram);
      expect(result.pix_key).toBe(mockPerson.pix_key);
    });
  });
});
