import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addVaquinhaHistory,
  deleteVaquinhaHistory,
  fetchAllVaquinhaHistory,
  fetchVaquinhaHistoryByYear,
  fetchAvailableYears,
  updateVaquinhaHistory,
  VaquinhaHistoryInput,
} from './vaquinhaHistory';

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./firebase', () => ({
  db: {},
}));

const mockBatchSet = vi.fn();
const mockBatchCommit = vi.fn(() => Promise.resolve());

vi.mock('firebase/firestore', () => ({
  writeBatch: vi.fn(() => ({ set: mockBatchSet, commit: mockBatchCommit })),
  collection: vi.fn(() => ({ id: 'mock-collection' })),
  doc: vi.fn((_, collectionName, id) => ({
    id: id || 'mock-id',
    collection: collectionName,
  })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  query: vi.fn((collection, ...constraints) => ({
    collection,
    constraints,
  })),
  where: vi.fn((field, op, value) => ({ field, op, value })),
  orderBy: vi.fn((field, direction) => ({ field, direction })),
  onSnapshot: vi.fn(),
  Query: vi.fn(),
}));

const mockDocData = {
  id: 'test-id',
  year: 2024,
  responsibleId: 1,
  responsibleName: 'Teste',
  birthdayPersonId: 2,
  birthdayPersonName: 'Aniversariante',
  createdAt: new Date().toISOString(),
};

const mockDocs = [
  {
    id: '1',
    year: 2024,
    responsibleId: 1,
    responsibleName: 'Teste 1',
    birthdayPersonId: 2,
    birthdayPersonName: 'Aniversariante 1',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    year: 2023,
    responsibleId: 3,
    responsibleName: 'Teste 2',
    birthdayPersonId: 4,
    birthdayPersonName: 'Aniversariante 2',
    createdAt: new Date('2023-06-20').toISOString(),
  },
];

describe('vaquinhaHistory service', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDoc, getDocs, onSnapshot } = await import('firebase/firestore');

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockDocData,
      metadata: { fromCache: false, hasPendingWrites: false },
      get: vi.fn(),
      id: mockDocData.id,
      ref: {},
    } as unknown as import('firebase/firestore').DocumentSnapshot);

    vi.mocked(getDocs).mockResolvedValue({
      forEach(
        callback: (doc: { data: () => (typeof mockDocs)[number] }) => void
      ) {
        mockDocs.forEach((doc) => callback({ data: () => doc }));
      },
    } as unknown as import('firebase/firestore').QuerySnapshot);

    vi.mocked(onSnapshot).mockImplementation((_query, _callback) => vi.fn());
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

  describe('updateVaquinhaHistory', () => {
    it('should update a vaquinha history entry', async () => {
      const { updateDoc } = await import('firebase/firestore');

      await updateVaquinhaHistory('test-id', {
        responsibleName: 'Novo Responsavel',
      });

      expect(updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-id',
          collection: 'vaquinha-history',
        }),
        expect.objectContaining({
          responsibleName: 'Novo Responsavel',
          updatedAt: expect.any(String),
        })
      );
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

  describe('batchAddVaquinhaHistory', () => {
    it('should batch add multiple vaquinha history entries', async () => {
      const { batchAddVaquinhaHistory } = await import('./vaquinhaHistory');
      const items: VaquinhaHistoryInput[] = [
        {
          year: 2024,
          responsibleId: 1,
          responsibleName: 'Responsavel 1',
          birthdayPersonId: 2,
          birthdayPersonName: 'Aniversariante 1',
        },
        {
          year: 2024,
          responsibleId: 3,
          responsibleName: 'Responsavel 2',
          birthdayPersonId: 4,
          birthdayPersonName: 'Aniversariante 2',
        },
      ];

      const ids = await batchAddVaquinhaHistory(items);

      expect(ids).toHaveLength(2);
      expect(mockBatchSet).toHaveBeenCalledTimes(2);
      expect(mockBatchCommit).toHaveBeenCalled();
    });
  });
});
