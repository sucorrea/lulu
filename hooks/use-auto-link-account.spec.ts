import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAutoLinkAccount } from './use-auto-link-account';
import type { User } from 'firebase/auth';

const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  doc: vi.fn(),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
}));

describe('useAutoLinkAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
  });

  it('should not link when user is null', () => {
    renderHook(() => useAutoLinkAccount(null));
    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it('should not link when user has no email', () => {
    const mockUser = { uid: '123' } as User;
    renderHook(() => useAutoLinkAccount(mockUser));
    expect(mockGetDocs).not.toHaveBeenCalled();
  });

  it('should not update when snapshot is empty', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

    renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('should mark as linked when uid already matches', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'p1', data: () => ({ uid: '123' }) }],
    });

    renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('should update uid when participant has no uid', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'p1', data: () => ({}) }],
    });

    renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  it('should not update uid when participant has different uid', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'p1', data: () => ({ uid: 'other-uid' }) }],
    });

    renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetDocs.mockRejectedValue(new Error('Firestore error'));

    renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao vincular conta:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('should not run twice due to ref guard', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'p1', data: () => ({}) }],
    });

    const { rerender } = renderHook(() => useAutoLinkAccount(mockUser));

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    });

    rerender();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
  });
});
