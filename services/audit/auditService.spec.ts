import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createAuditLog,
  getAuditLogs,
  getAuditLogsByUser,
  getLatestAudit,
  getAuditLogsByChangedField,
  countAuditLogs,
  getAllAuditLogs,
} from './auditService';
import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
} from 'firebase/firestore';

vi.mock('@/services/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  collectionGroup: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));

describe('auditService', () => {
  const MOCK_IP_ADDRESS = '192.168.1.1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAuditLog', () => {
    it('should create audit log with correct structure', async () => {
      const { addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(mockDocRef);

      const result = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João Silva',
        userEmail: 'joao@example.com',
        changes: [
          {
            field: 'pix_key',
            oldValue: '12345678900',
            newValue: '98765432100',
            fieldType: 'string',
          },
        ],
        source: 'web-form',
      });

      expect(result).toBeDefined();
      expect(result.participantId).toBe(1);
      expect(result.userId).toBe('user123');
      expect(result.userName).toBe('João Silva');
      expect(result.changes).toHaveLength(1);
      expect(result.timestamp).toBeDefined();
    });

    it('should generate unique audit log ID with timestamp', async () => {
      const { addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(mockDocRef);

      const result1 = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      const result2 = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
      });

      expect(result1.id).not.toBe(result2.id);
    });

    it('should include metadata in audit log', async () => {
      const { addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(mockDocRef);

      const result = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
        source: 'api',
        ipAddress: MOCK_IP_ADDRESS,
        userAgent: 'Mozilla/5.0',
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('api');
      expect(result.metadata?.ipAddress).toBe(MOCK_IP_ADDRESS);
      expect(result.metadata?.userAgent).toBe('Mozilla/5.0');
    });

    it('should default metadata source to web-form', async () => {
      const { addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(
        mockDocRef as unknown as DocumentReference<unknown, DocumentData>
      );

      const result = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
      });

      expect(result.metadata?.source).toBe('web-form');
    });

    it('should exclude undefined ipAddress and userAgent from metadata', async () => {
      const { addDoc } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(mockDocRef);

      const result = await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
        ipAddress: undefined,
        userAgent: undefined,
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.source).toBe('web-form');
      expect('ipAddress' in (result.metadata || {})).toBe(false);
      expect('userAgent' in (result.metadata || {})).toBe(false);
    });

    it('should call addDoc with correct collection path', async () => {
      const { addDoc, collection } = await import('firebase/firestore');
      const mockDocRef = { id: 'doc123' } as unknown as DocumentReference<
        unknown,
        DocumentData
      >;
      vi.mocked(addDoc).mockResolvedValue(
        mockDocRef as unknown as DocumentReference<unknown, DocumentData>
      );

      await createAuditLog(1, {
        userId: 'user123',
        userName: 'João',
        changes: [],
      });

      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        'participants',
        '1',
        'audit'
      );
    });
  });

  describe('getAuditLogs', () => {
    it('should fetch audit logs ordered by timestamp descending', async () => {
      const { getDocs, orderBy, limit } = await import('firebase/firestore');

      const mockLogs = [
        {
          id: 'log1',
          data: () => ({
            timestamp: '2026-02-05T15:30:00Z',
            userId: 'user1',
            userName: 'João',
            changes: [],
          }),
        },
        {
          id: 'log2',
          data: () => ({
            timestamp: '2026-02-04T10:00:00Z',
            userId: 'user1',
            userName: 'João',
            changes: [],
          }),
        },
      ];

      const mockSnapshot = {
        forEach: vi.fn((callback) => {
          mockLogs.forEach((log) => callback(log));
        }),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAuditLogs(1, 10);

      expect(result).toHaveLength(2);
      expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(limit).toHaveBeenCalledWith(10);
    });

    it('should return empty array when no logs exist', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        forEach: vi.fn(),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAuditLogs(1);

      expect(result).toHaveLength(0);
    });

    it('should respect limit parameter', async () => {
      const { getDocs, limit } = await import('firebase/firestore');

      const mockSnapshot = {
        forEach: vi.fn(),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      await getAuditLogs(1, 5);

      expect(limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getAuditLogsByUser', () => {
    it('should filter logs by userId', async () => {
      const { getDocs, where, orderBy, limit } = await import(
        'firebase/firestore'
      );

      const mockSnapshot = {
        forEach: vi.fn(),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      await getAuditLogsByUser(1, 'user123', 10);

      expect(where).toHaveBeenCalledWith('userId', '==', 'user123');
      expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(limit).toHaveBeenCalledWith(10);
    });
  });

  describe('getLatestAudit', () => {
    it('should return single most recent log', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockLog = {
        id: 'log1',
        data: () => ({
          timestamp: '2026-02-05T15:30:00Z',
          userId: 'user1',
          userName: 'João',
          changes: [
            {
              field: 'email',
              oldValue: 'old@example.com',
              newValue: 'new@example.com',
              fieldType: 'string',
            },
          ],
        }),
      };

      const mockSnapshot = {
        forEach: vi.fn((callback) => callback(mockLog)),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getLatestAudit(1);

      expect(result).toBeDefined();
      expect(result?.timestamp).toBe('2026-02-05T15:30:00Z');
    });

    it('should return null when no logs exist', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        forEach: vi.fn(),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getLatestAudit(1);

      expect(result).toBeNull();
    });
  });

  describe('getAuditLogsByChangedField', () => {
    it('should filter logs by changed field', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockLogs = [
        {
          id: 'log1',
          data: () => ({
            timestamp: '2026-02-05T15:30:00Z',
            userId: 'user1',
            userName: 'João',
            changes: [
              {
                field: 'pix_key',
                oldValue: '12345678900',
                newValue: '98765432100',
                fieldType: 'string',
              },
            ],
          }),
        },
        {
          id: 'log2',
          data: () => ({
            timestamp: '2026-02-04T10:00:00Z',
            userId: 'user1',
            userName: 'João',
            changes: [
              {
                field: 'email',
                oldValue: 'old@example.com',
                newValue: 'new@example.com',
                fieldType: 'string',
              },
            ],
          }),
        },
      ];

      const mockSnapshot = {
        forEach: vi.fn((callback) => {
          mockLogs.forEach((log) => callback(log));
        }),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAuditLogsByChangedField(1, 'pix_key');

      expect(result.length).toBeLessThanOrEqual(mockLogs.length);
      expect(
        result.every((log) =>
          log.changes.some((change) => change.field === 'pix_key')
        )
      ).toBe(true);
    });

    it('should return empty array when no logs have the field change', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockLogs = [
        {
          id: 'log1',
          data: () => ({
            timestamp: '2026-02-05T15:30:00Z',
            userId: 'user1',
            userName: 'João',
            changes: [
              {
                field: 'email',
                oldValue: 'old@example.com',
                newValue: 'new@example.com',
                fieldType: 'string',
              },
            ],
          }),
        },
      ];

      const mockSnapshot = {
        forEach: vi.fn((callback) => {
          mockLogs.forEach((log) => callback(log));
        }),
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAuditLogsByChangedField(1, 'pix_key');

      expect(result).toHaveLength(0);
    });
  });

  describe('countAuditLogs', () => {
    it('should return total count of audit logs', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        size: 5,
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await countAuditLogs(1);

      expect(result).toBe(5);
    });

    it('should return 0 when no logs exist', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        size: 0,
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await countAuditLogs(1);

      expect(result).toBe(0);
    });
  });

  describe('getAllAuditLogs', () => {
    it('should fetch all audit logs across participants using collectionGroup', async () => {
      const { getDocs, collectionGroup, query, orderBy, limit } = await import(
        'firebase/firestore'
      );

      const mockSnapshot = {
        forEach: (callback: (doc: unknown) => void) => {
          callback({
            id: 'log1',
            ref: { path: 'participants/1/audit/log1' },
            data: () => ({
              timestamp: '2026-01-10T10:00:00Z',
              userId: 'user1',
              userName: 'João',
              participantId: 1,
              changes: [],
            }),
          });
          callback({
            id: 'log2',
            ref: { path: 'participants/2/audit/log2' },
            data: () => ({
              timestamp: '2026-01-09T10:00:00Z',
              userId: 'user2',
              userName: 'Maria',
              participantId: 2,
              changes: [],
            }),
          });
        },
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAllAuditLogs(50);

      expect(collectionGroup).toHaveBeenCalledWith({}, 'audit');
      expect(query).toHaveBeenCalled();
      expect(orderBy).toHaveBeenCalledWith('timestamp', 'desc');
      expect(limit).toHaveBeenCalledWith(50);
      expect(result).toHaveLength(2);
      expect(result[0].participantId).toBe(1);
      expect(result[1].participantId).toBe(2);
    });

    it('should extract participantId from path when not in document', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        forEach: (callback: (doc: unknown) => void) => {
          callback({
            id: 'log1',
            ref: { path: 'participants/5/audit/log1' },
            data: () => ({
              timestamp: '2026-01-10T10:00:00Z',
              userId: 'user1',
              userName: 'João',
              changes: [],
            }),
          });
        },
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAllAuditLogs();

      expect(result).toHaveLength(1);
      expect(result[0].participantId).toBe(5);
    });

    it('should return empty array when no audit logs exist', async () => {
      const { getDocs } = await import('firebase/firestore');

      const mockSnapshot = {
        forEach: () => {},
      };

      vi.mocked(getDocs).mockResolvedValue(
        mockSnapshot as unknown as QuerySnapshot<unknown, DocumentData>
      );

      const result = await getAllAuditLogs();

      expect(result).toHaveLength(0);
    });
  });
});
