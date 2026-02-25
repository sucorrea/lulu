import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addVaquinhaHistory,
  deleteVaquinhaHistory,
  fetchVaquinhaHistoryById,
  fetchAllVaquinhaHistory,
  fetchVaquinhaHistoryByYear,
  fetchAvailableYears,
  fetchVaquinhaHistoryByResponsible,
  fetchVaquinhaHistoryByBirthdayPerson,
  updateVaquinhaHistory,
  listenVaquinhaHistory,
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

  describe('fetchVaquinhaHistoryById', () => {
    it('should fetch a vaquinha history entry by id', async () => {
      const result = await fetchVaquinhaHistoryById('test-id');
      expect(result).toBeDefined();
      expect(result?.year).toBe(2024);
    });

    it('should return null and warn when doc does not exist', async () => {
      const { getDoc } = await import('firebase/firestore');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => false,
        data: () => null,
        metadata: { fromCache: false, hasPendingWrites: false },
        get: vi.fn(),
        id: 'missing-id',
        ref: {},
      } as unknown as import('firebase/firestore').DocumentSnapshot);

      const result = await fetchVaquinhaHistoryById('missing-id');

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should return null on error', async () => {
      const { getDoc } = await import('firebase/firestore');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(getDoc).mockRejectedValueOnce(new Error('boom'));

      const result = await fetchVaquinhaHistoryById('error-id');

      expect(result).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
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

  describe('fetchVaquinhaHistoryByResponsible', () => {
    it('should fetch vaquinha history entries by responsible', async () => {
      const result = await fetchVaquinhaHistoryByResponsible(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('fetchVaquinhaHistoryByBirthdayPerson', () => {
    it('should fetch vaquinha history entries by birthday person', async () => {
      const result = await fetchVaquinhaHistoryByBirthdayPerson(2);
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

  describe('listenVaquinhaHistory', () => {
    it('should listen to history updates and return unsubscribe', async () => {
      const { onSnapshot } = await import('firebase/firestore');
      const callback = vi.fn();
      const unsubscribe = vi.fn();

      vi.mocked(onSnapshot).mockImplementationOnce((...args: unknown[]) => {
        const listener = args[1] as
          | {
              forEach: (innerCallback: any) => void;
            }
          | ((snapshot: { forEach: (innerCallback: any) => void }) => void);

        const snapshot = {
          forEach: (innerCallback: any) => {
            innerCallback({ data: () => mockDocs[0] });
          },
        };

        if (typeof listener === 'function') {
          listener(snapshot);
        } else {
          (
            listener as {
              forEach: (innerCallback: any) => void;
            }
          ).forEach(snapshot.forEach);
        }

        return unsubscribe;
      });

      const result = listenVaquinhaHistory(callback);

      expect(result).toBe(unsubscribe);
      expect(callback).toHaveBeenCalledWith([mockDocs[0]]);
    });

    it('should apply year filter when provided', async () => {
      const { onSnapshot, where } = await import('firebase/firestore');

      vi.mocked(onSnapshot).mockImplementationOnce((...args: unknown[]) => {
        const listener = args[1] as
          | {
              forEach: (innerCallback: any) => void;
            }
          | ((snapshot: { forEach: (innerCallback: any) => void }) => void);

        const snapshot = {
          forEach: (_innerCallback: any) => {},
        };

        if (typeof listener === 'function') {
          listener(snapshot);
        } else {
          (
            listener as {
              forEach: (innerCallback: any) => void;
            }
          ).forEach(snapshot.forEach);
        }

        return vi.fn();
      });

      listenVaquinhaHistory(vi.fn(), 2024);

      expect(where).toHaveBeenCalledWith('year', '==', 2024);
    });
  });

  describe('deleteVaquinhaHistory', () => {
    it('should delete a vaquinha history entry', async () => {
      await expect(deleteVaquinhaHistory('test-id')).resolves.not.toThrow();
    });
  });
});
