import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateParticipantData } from './updateParticipant';

vi.mock('@/lib/auth-guard', () => ({
  assertAdmin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/services/audit', () => ({
  calculateDiff: vi.fn(() => []),
  createAuditLog: vi.fn(),
  hasChanges: vi.fn(() => false),
}));

describe('updateParticipantData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update participant data in Firestore', async () => {
    const { updateDoc } = await import('firebase/firestore');

    await updateParticipantData('1', {
      updatedData: {
        name: 'New Name',
      },
    });

    expect(updateDoc).toHaveBeenCalled();
  });

  it('should create audit log when user info is provided and there are changes', async () => {
    const { updateDoc, getDoc } = await import('firebase/firestore');
    const { calculateDiff, createAuditLog, hasChanges } = await import(
      '@/services/audit'
    );

    const mockDocData = {
      name: 'Old Name',
      email: 'old@example.com',
    };

    const mockDocSnapshot = {
      exists: () => true,
      data: () => mockDocData,
    };

    vi.mocked(getDoc).mockResolvedValue(
      mockDocSnapshot as unknown as DocumentSnapshot<unknown, DocumentData>
    );

    const mockChanges = [
      {
        field: 'name',
        oldValue: 'Old Name',
        newValue: 'New Name',
        fieldType: 'string' as const,
      },
    ];

    vi.mocked(calculateDiff).mockReturnValue(mockChanges);
    vi.mocked(hasChanges).mockReturnValue(true);

    await updateParticipantData('1', {
      updatedData: {
        name: 'New Name',
      },
      userId: 'user123',
      userName: 'João Silva',
      userEmail: 'joao@example.com',
    });

    expect(updateDoc).toHaveBeenCalled();
    expect(createAuditLog).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        userId: 'user123',
        userName: 'João Silva',
        userEmail: 'joao@example.com',
        changes: mockChanges,
      })
    );
  });

  it('should not create audit log when no userId is provided', async () => {
    const { updateDoc } = await import('firebase/firestore');
    const { createAuditLog } = await import('@/services/audit');

    await updateParticipantData('1', {
      updatedData: {
        name: 'New Name',
      },
    });

    expect(updateDoc).toHaveBeenCalled();
    expect(createAuditLog).not.toHaveBeenCalled();
  });

  it('should not create audit log when there are no changes', async () => {
    const { updateDoc, getDoc } = await import('firebase/firestore');
    const { createAuditLog, hasChanges } = await import('@/services/audit');

    const mockDocSnapshot = {
      exists: () => true,
      data: () => ({ name: 'John' }),
    };

    vi.mocked(getDoc).mockResolvedValue(
      mockDocSnapshot as unknown as DocumentSnapshot<unknown, DocumentData>
    );
    vi.mocked(hasChanges).mockReturnValue(false);

    await updateParticipantData('1', {
      updatedData: {
        name: 'John',
      },
      userId: 'user123',
      userName: 'João',
    });

    expect(updateDoc).toHaveBeenCalled();
    expect(createAuditLog).not.toHaveBeenCalled();
  });

  it('should complete update even if audit log creation fails', async () => {
    const { updateDoc, getDoc } = await import('firebase/firestore');
    const { createAuditLog, hasChanges, calculateDiff } = await import(
      '@/services/audit'
    );

    const mockDocSnapshot = {
      exists: () => true,
      data: () => ({ name: 'Old Name' }),
    };

    vi.mocked(getDoc).mockResolvedValue(
      mockDocSnapshot as unknown as DocumentSnapshot<unknown, DocumentData>
    );
    vi.mocked(hasChanges).mockReturnValue(true);
    vi.mocked(calculateDiff).mockReturnValue([
      {
        field: 'name',
        oldValue: 'Old Name',
        newValue: 'New Name',
        fieldType: 'string' as const,
      },
    ]);

    vi.mocked(createAuditLog).mockRejectedValue(new Error('Audit error'));

    await expect(
      updateParticipantData('1', {
        updatedData: {
          name: 'New Name',
        },
        userId: 'user123',
        userName: 'João',
      })
    ).resolves.not.toThrow();

    expect(updateDoc).toHaveBeenCalled();
  });

  it('should warn and proceed without audit when getDoc fails', async () => {
    const { updateDoc, getDoc } = await import('firebase/firestore');
    const { createAuditLog } = await import('@/services/audit');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(getDoc).mockRejectedValueOnce(new Error('Firestore error'));

    await expect(
      updateParticipantData('1', {
        updatedData: { name: 'New Name' },
        userId: 'user123',
        userName: 'João',
      })
    ).resolves.not.toThrow();

    expect(updateDoc).toHaveBeenCalled();
    expect(createAuditLog).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
