import { describe, it, expect, vi, beforeEach } from 'vitest';

const queryMocks = vi.hoisted(() => ({
  fetchParticipants: vi.fn(),
  fetchParticipantById: vi.fn(),
}));

vi.mock('react', () => ({
  cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

vi.mock('@/services/queries/fetchParticipants', () => queryMocks);

describe('participants-server', () => {
  const load = async () => {
    const mod = await import('./participants-server');
    return mod;
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('getParticipants delegates to fetchParticipants', async () => {
    const data = [{ id: '1' }];
    queryMocks.fetchParticipants.mockResolvedValueOnce(data);

    const { getParticipants } = await load();
    const result = await getParticipants();

    expect(result).toBe(data);
    expect(queryMocks.fetchParticipants).toHaveBeenCalledTimes(1);
  });

  it('getParticipantById delegates to fetchParticipantById', async () => {
    const data = { id: 'abc' };
    queryMocks.fetchParticipantById.mockResolvedValueOnce(data);

    const { getParticipantById } = await load();
    const result = await getParticipantById('abc');

    expect(result).toBe(data);
    expect(queryMocks.fetchParticipantById).toHaveBeenCalledWith('abc');
  });
});
