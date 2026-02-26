import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRefetchParticipant = vi.fn();
const mockInvalidateQueries = vi.fn();
let capturedMutationConfig: Record<string, unknown> = {};

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetParticipantById: vi.fn(() => ({
    refetch: mockRefetchParticipant,
  })),
}));

vi.mock('@/services/queries/uploadPhoto', () => ({
  uploadPhoto: vi.fn().mockResolvedValue('https://example.com/photo.jpg'),
}));

vi.mock('@/app/actions/participants', () => ({
  revalidateParticipantsCache: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn((config) => {
    capturedMutationConfig = config;
    return { mutate: vi.fn(), ...config };
  }),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
}));

describe('useUploadPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedMutationConfig = {};
  });

  it('should configure useMutation with uploadPhoto as mutationFn', async () => {
    const { useMutation } = await import('@tanstack/react-query');
    const { useUploadPhoto } = await import('./useUploadPhoto');
    const { uploadPhoto } = await import('@/services/queries/uploadPhoto');

    useUploadPhoto('participant-123');

    expect(useMutation).toHaveBeenCalled();
    expect(capturedMutationConfig.mutationFn).toBe(uploadPhoto);
  });

  it('should refetch, invalidate queries, and revalidate cache on success', async () => {
    const { useUploadPhoto } = await import('./useUploadPhoto');
    const { revalidateParticipantsCache } = await import(
      '@/app/actions/participants'
    );

    useUploadPhoto('participant-123');

    const onSuccess = capturedMutationConfig.onSuccess as () => void;
    onSuccess();

    expect(mockRefetchParticipant).toHaveBeenCalled();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['get-all-participants'],
    });
    expect(revalidateParticipantsCache).toHaveBeenCalled();
  });

  it('should refetch participant on error', async () => {
    const { useUploadPhoto } = await import('./useUploadPhoto');

    useUploadPhoto('participant-123');

    const onError = capturedMutationConfig.onError as () => void;
    onError();

    expect(mockRefetchParticipant).toHaveBeenCalled();
  });

  it('should pass the participant id to useGetParticipantById', async () => {
    const { useGetParticipantById } = await import(
      '@/services/queries/fetchParticipants'
    );
    const { useUploadPhoto } = await import('./useUploadPhoto');

    useUploadPhoto('participant-789');

    expect(useGetParticipantById).toHaveBeenCalledWith('participant-789');
  });
});
