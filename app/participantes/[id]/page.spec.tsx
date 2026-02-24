import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { notFound } from 'next/navigation';
import { decryptId } from '@/lib/crypto';
import { getParticipantById } from '@/services/participants-server';
import ParticipantsPage from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/crypto', () => ({
  decryptId: vi.fn(),
}));

vi.mock('@/services/participants-server', () => ({
  getParticipantById: vi.fn(),
}));

vi.mock('@/components/lulus/lulu-card/lulu-card-edit', () => ({
  default: ({ participantId }: { participantId: string }) => (
    <div>LulusCardEdit - {participantId}</div>
  ),
}));

const mockNotFound = vi.mocked(notFound);
const mockDecryptId = vi.mocked(decryptId);
const mockGetParticipantById = vi.mocked(getParticipantById);

describe('ParticipantsPage', () => {
  it('should call notFound when decryptId throws', async () => {
    mockDecryptId.mockImplementation(() => {
      throw new Error('invalid id');
    });

    await expect(
      ParticipantsPage({ params: Promise.resolve({ id: 'invalid' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should call notFound when decryptId returns null', async () => {
    mockDecryptId.mockReturnValue(null as unknown as string);

    await expect(
      ParticipantsPage({ params: Promise.resolve({ id: 'abc' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('should render LulusCardEdit when id is valid', async () => {
    mockDecryptId.mockReturnValue('decrypted-123');
    mockGetParticipantById.mockResolvedValue(null);

    const page = await ParticipantsPage({
      params: Promise.resolve({ id: 'encrypted-abc' }),
    });
    render(page);

    expect(
      screen.getByText('LulusCardEdit - decrypted-123')
    ).toBeInTheDocument();
  });
});
