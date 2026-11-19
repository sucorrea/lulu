import { describe, it, expect } from 'vitest';
import {
  getParticipantPhotoUrl,
  getInitials,
  canOptimizeImage,
} from './participant-photo';
import { Person } from './types';

const mockPerson: Person = {
  id: 1,
  name: 'Test Person',
  fullName: 'Test Person Full',
  date: new Date('1990-05-15'),
  month: '05',
  city: 'Test City',
  photoURL: 'https://example.com/photo.jpg',
  photoUpdatedAt: 12345,
};

describe('participant-photo', () => {
  describe('getParticipantPhotoUrl', () => {
    it('should return empty string when no photo available', () => {
      const person = { ...mockPerson, photoURL: undefined, picture: undefined };
      expect(getParticipantPhotoUrl(person)).toBe('');
    });

    it('should return photoURL with version parameter', () => {
      const result = getParticipantPhotoUrl(mockPerson);
      expect(result).toBe('https://example.com/photo.jpg?v=12345');
    });

    it('should return photoURL without version when photoUpdatedAt is not present', () => {
      const person = { ...mockPerson, photoUpdatedAt: undefined };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe('https://example.com/photo.jpg');
    });

    it('should use picture as fallback', () => {
      const person = {
        ...mockPerson,
        photoURL: undefined,
        picture: 'https://example.com/picture.jpg',
        photoUpdatedAt: 12345,
      };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe('https://example.com/picture.jpg?v=12345');
    });

    it('should use & separator when URL already has query params', () => {
      const person = {
        ...mockPerson,
        photoURL: 'https://example.com/photo.jpg?existing=param',
      };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe(
        'https://example.com/photo.jpg?existing=param&v=12345'
      );
    });
  });

  describe('getInitials', () => {
    it('should return initials from full name', () => {
      const result = getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('should return first two letters for single name', () => {
      const result = getInitials('John');
      expect(result).toBe('J');
    });

    it('should handle three names', () => {
      const result = getInitials('John Middle Doe');
      expect(result).toBe('JM');
    });

    it('should convert to uppercase', () => {
      const result = getInitials('john doe');
      expect(result).toBe('JD');
    });

    it('should handle empty string', () => {
      const result = getInitials('');
      expect(result).toBe('');
    });
  });

  describe('canOptimizeImage', () => {
    it('accepts local paths', () => {
      expect(canOptimizeImage('/luluzinha_no_background.png')).toBe(true);
      expect(canOptimizeImage('/photos/a.jpg?v=123')).toBe(true);
    });

    it('accepts Cloudinary URLs', () => {
      expect(
        canOptimizeImage(
          'https://res.cloudinary.com/demo/image/upload/a.jpg?v=1'
        )
      ).toBe(true);
    });

    it('rejects other hosts, protocol-relative and blob URLs', () => {
      expect(canOptimizeImage('https://lh3.googleusercontent.com/a.jpg')).toBe(
        false
      );
      expect(canOptimizeImage('//res.cloudinary.com/a.jpg')).toBe(false);
      expect(canOptimizeImage('blob:http://localhost/123')).toBe(false);
      expect(
        canOptimizeImage('https://res.cloudinary.com.evil.com/a.jpg')
      ).toBe(false);
      expect(canOptimizeImage('')).toBe(false);
    });
  });
});
