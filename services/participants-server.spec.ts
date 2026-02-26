import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Person } from '@/components/lulus/types';

const mockGet = vi.fn();
const mockDocGet = vi.fn();
const mockDoc = vi.fn(() => ({ get: mockDocGet }));
const mockCollection = vi.fn(() => ({ get: mockGet, doc: mockDoc }));

vi.mock('react', () => ({
  cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

vi.mock('@/lib/firebase-admin', () => ({
  adminDb: {
    collection: mockCollection,
  },
}));

describe('participants-server', () => {
  const load = async () => {
    const mod = await import('./participants-server');
    return mod;
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockCollection.mockReturnValue({ get: mockGet, doc: mockDoc });
    mockDoc.mockReturnValue({ get: mockDocGet });
  });

  it('getParticipants returns mapped docs from adminDb', async () => {
    const data: Partial<Person>[] = [{ id: 1, name: 'Alice' }];
    mockGet.mockResolvedValueOnce({
      docs: data.map((d) => ({ data: () => d })),
    });

    const { getParticipants } = await load();
    const result = await getParticipants();

    expect(mockCollection).toHaveBeenCalledWith('participants');
    expect(result).toEqual(data);
  });

  it('getParticipantById returns participant when doc exists', async () => {
    const data: Partial<Person> = { id: 1, name: 'Alice' };
    mockDocGet.mockResolvedValueOnce({ exists: true, data: () => data });

    const { getParticipantById } = await load();
    const result = await getParticipantById('1');

    expect(mockCollection).toHaveBeenCalledWith('participants');
    expect(mockDoc).toHaveBeenCalledWith('1');
    expect(result).toEqual(data);
  });

  it('getParticipantById returns null when doc does not exist', async () => {
    mockDocGet.mockResolvedValueOnce({ exists: false, data: () => null });

    const { getParticipantById } = await load();
    const result = await getParticipantById('unknown');

    expect(result).toBeNull();
  });

  it('getParticipants propagates error when adminDb fails', async () => {
    const networkError = new Error('Network error');
    mockGet.mockRejectedValueOnce(networkError);

    const { getParticipants } = await load();

    await expect(getParticipants()).rejects.toThrow('Network error');
  });

  it('getParticipantById returns null when adminDb fails', async () => {
    const permissionError = new Error('Permission denied');
    mockDocGet.mockRejectedValueOnce(permissionError);

    const { getParticipantById } = await load();

    const result = await getParticipantById('1');
    expect(result).toBeNull();
  });
});
