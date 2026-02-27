import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAssertAdmin = vi.fn();
const mockSetDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockGetDocs = vi.fn();

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: () => mockAssertAdmin(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn((_db, _col, id) => ({ id })),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  query: vi.fn(),
  orderBy: vi.fn(),
}));

import {
  createParticipant,
  deleteParticipant,
  updateParticipantRole,
  fetchAllParticipantsAdmin,
} from './participants-admin';

describe('participants-admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAssertAdmin.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
    mockUpdateDoc.mockResolvedValue(undefined);
  });

  describe('createParticipant', () => {
    it('should assert admin and create participant with next id', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          { data: () => ({ id: 3 }) },
          { data: () => ({ id: 7 }) },
          { data: () => ({ id: 1 }) },
        ],
      });

      const result = await createParticipant({
        fullName: 'Test User',
        name: 'Test',
        date: '2000-01-01',
        month: 'Janeiro',
        city: 'SP',
      });

      expect(mockAssertAdmin).toHaveBeenCalled();
      expect(mockSetDoc).toHaveBeenCalled();
      expect(result).toBe('8');
    });

    it('should default role to lulu when not provided', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      await createParticipant({
        fullName: 'Test',
        name: 'Test',
        date: '2000-01-01',
        month: 'Janeiro',
        city: 'SP',
      });

      const setDocCall = mockSetDoc.mock.calls[0][1];
      expect(setDocCall.role).toBe('lulu');
    });

    it('should use provided role', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      await createParticipant({
        fullName: 'Admin User',
        name: 'Admin',
        date: '2000-01-01',
        month: 'Janeiro',
        city: 'SP',
        role: 'admin',
      });

      const setDocCall = mockSetDoc.mock.calls[0][1];
      expect(setDocCall.role).toBe('admin');
    });

    it('should start at id 1 when no docs exist', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      const result = await createParticipant({
        fullName: 'First',
        name: 'First',
        date: '2000-01-01',
        month: 'Janeiro',
        city: 'SP',
      });

      expect(result).toBe('1');
    });
  });

  describe('deleteParticipant', () => {
    it('should assert admin and delete participant', async () => {
      await deleteParticipant('123');

      expect(mockAssertAdmin).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  describe('updateParticipantRole', () => {
    it('should assert admin and update role', async () => {
      await updateParticipantRole('123', 'admin');

      expect(mockAssertAdmin).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
        role: 'admin',
      });
    });
  });

  describe('fetchAllParticipantsAdmin', () => {
    it('should assert admin and return participants with docId', async () => {
      mockGetDocs.mockResolvedValue({
        docs: [
          { id: 'doc1', data: () => ({ name: 'Alice', id: 1 }) },
          { id: 'doc2', data: () => ({ name: 'Bob', id: 2 }) },
        ],
      });

      const result = await fetchAllParticipantsAdmin();

      expect(mockAssertAdmin).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].docId).toBe('doc1');
      expect(result[0].name).toBe('Alice');
      expect(result[1].docId).toBe('doc2');
    });

    it('should return empty array when no participants', async () => {
      mockGetDocs.mockResolvedValue({ docs: [] });

      const result = await fetchAllParticipantsAdmin();

      expect(result).toHaveLength(0);
    });
  });
});
