import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addVaquinhaHistory,
  deleteVaquinhaHistory,
  fetchVaquinhaHistoryById,
  fetchAllVaquinhaHistory,
  fetchVaquinhaHistoryByYear,
  fetchAvailableYears,
  VaquinhaHistoryInput,
} from './vaquinhaHistory';

vi.mock('./firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ id: 'mock-collection' })),
  doc: vi.fn((_, collectionName, id) => ({
    id: id || 'mock-id',
    collection: collectionName,
  })),
  getDoc: vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({
        id: 'test-id',
        year: 2024,
        responsibleId: 1,
        responsibleName: 'Teste',
        birthdayPersonId: 2,
        birthdayPersonName: 'Aniversariante',
        createdAt: new Date().toISOString(),
      }),
    })
  ),
  getDocs: vi.fn(() =>
    Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      forEach: (callback: any) => {
        callback({
          data: () => ({
            id: '1',
            year: 2024,
            responsibleId: 1,
            responsibleName: 'Teste 1',
            birthdayPersonId: 2,
            birthdayPersonName: 'Aniversariante 1',
          }),
        });
        callback({
          data: () => ({
            id: '2',
            year: 2023,
            responsibleId: 3,
            responsibleName: 'Teste 2',
            birthdayPersonId: 4,
            birthdayPersonName: 'Aniversariante 2',
          }),
        });
      },
    })
  ),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  query: vi.fn((collection, ...constraints) => ({
    collection,
    constraints,
  })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
  orderBy: vi.fn((field, direction) => ({ field, direction })),
  onSnapshot: vi.fn((_query, _callback) => {
    const unsubscribe = vi.fn();
    return unsubscribe;
  }),
  Query: vi.fn(),
}));

describe('vaquinhaHistory service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addVaquinhaHistory', () => {
    it('should add a new vaquinha history entry', async () => {
      const input: VaquinhaHistoryInput = {
        year: 2024,
        responsibleId: 1,
        responsibleName: 'Teste',
        birthdayPersonId: 2,
        birthdayPersonName: 'Aniversariante',
      };

      const id = await addVaquinhaHistory(input);
      expect(id).toBe('mock-id');
    });
  });

  describe('fetchVaquinhaHistoryById', () => {
    it('should fetch a vaquinha history entry by id', async () => {
      const result = await fetchVaquinhaHistoryById('test-id');
      expect(result).toBeDefined();
      expect(result?.year).toBe(2024);
    });
  });

  describe('fetchAllVaquinhaHistory', () => {
    it('should fetch all vaquinha history entries', async () => {
      const result = await fetchAllVaquinhaHistory();
      expect(result).toHaveLength(2);
      expect(result[0].year).toBe(2024);
      expect(result[1].year).toBe(2023);
    });
  });

  describe('fetchVaquinhaHistoryByYear', () => {
    it('should fetch vaquinha history entries by year', async () => {
      const result = await fetchVaquinhaHistoryByYear(2024);
      expect(result).toHaveLength(2);
    });
  });

  describe('fetchAvailableYears', () => {
    it('should fetch available years from history', async () => {
      const result = await fetchAvailableYears();
      expect(result).toContain(2024);
      expect(result).toContain(2023);
    });
  });

  describe('deleteVaquinhaHistory', () => {
    it('should delete a vaquinha history entry', async () => {
      await expect(deleteVaquinhaHistory('test-id')).resolves.not.toThrow();
    });
  });
});
