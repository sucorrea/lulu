import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useAuditLogs,
  useAuditLogsByUser,
  useAllAuditLogs,
} from './fetchAuditLogs';
import { AuditLog } from '@/services/audit';

vi.mock('@/services/audit', () => ({
  getAuditLogs: vi.fn(),
  getAuditLogsByUser: vi.fn(),
}));

describe('fetchAuditLogs hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useAuditLogs', () => {
    it('should fetch audit logs for a participant', async () => {
      const { getAuditLogs } = await import('@/services/audit');
      const mockLogs: AuditLog[] = [
        {
          id: 'log1',
          timestamp: '2026-02-05T10:00:00Z',
          userId: 'user1',
          userName: 'João Silva',
          changes: [],
        },
      ];

      vi.mocked(getAuditLogs).mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useAuditLogs(1, 10), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockLogs);
      expect(getAuditLogs).toHaveBeenCalledWith(1, 10);
    });

    it('should not fetch when participantId is 0', () => {
      const { result } = renderHook(() => useAuditLogs(0, 10), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useAuditLogsByUser', () => {
    it('should fetch audit logs filtered by user', async () => {
      const { getAuditLogsByUser } = await import('@/services/audit');
      const mockLogs: AuditLog[] = [
        {
          id: 'log1',
          timestamp: '2026-02-05T10:00:00Z',
          userId: 'user1',
          userName: 'João Silva',
          changes: [],
        },
      ];

      vi.mocked(getAuditLogsByUser).mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useAuditLogsByUser(1, 'user1', 10), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockLogs);
      expect(getAuditLogsByUser).toHaveBeenCalledWith(1, 'user1', 10);
    });

    it('should not fetch when userId is empty', () => {
      const { result } = renderHook(() => useAuditLogsByUser(1, '', 10), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useAllAuditLogs', () => {
    it('should fetch and merge audit logs from multiple participants', async () => {
      const { getAuditLogs } = await import('@/services/audit');

      const mockLogs1: AuditLog[] = [
        {
          id: 'log1',
          timestamp: '2026-02-05T10:00:00Z',
          userId: 'user1',
          userName: 'João Silva',
          changes: [],
        },
      ];

      const mockLogs2: AuditLog[] = [
        {
          id: 'log2',
          timestamp: '2026-02-04T10:00:00Z',
          userId: 'user2',
          userName: 'Maria Santos',
          changes: [],
        },
      ];

      vi.mocked(getAuditLogs)
        .mockResolvedValueOnce(mockLogs1)
        .mockResolvedValueOnce(mockLogs2);

      const { result } = renderHook(() => useAllAuditLogs([1, 2], 10), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].id).toBe('log1');
      expect(result.current.data?.[1].id).toBe('log2');
    });

    it('should sort logs by timestamp descending', async () => {
      const { getAuditLogs } = await import('@/services/audit');

      const mockLogs1: AuditLog[] = [
        {
          id: 'log1',
          timestamp: '2026-02-03T10:00:00Z',
          userId: 'user1',
          userName: 'João Silva',
          changes: [],
        },
      ];

      const mockLogs2: AuditLog[] = [
        {
          id: 'log2',
          timestamp: '2026-02-05T10:00:00Z',
          userId: 'user2',
          userName: 'Maria Santos',
          changes: [],
        },
      ];

      vi.mocked(getAuditLogs)
        .mockResolvedValueOnce(mockLogs1)
        .mockResolvedValueOnce(mockLogs2);

      const { result } = renderHook(() => useAllAuditLogs([1, 2], 10), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].id).toBe('log2');
      expect(result.current.data?.[1].id).toBe('log1');
    });

    it('should not fetch when participantIds is empty', () => {
      const { result } = renderHook(() => useAllAuditLogs([], 10), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});
