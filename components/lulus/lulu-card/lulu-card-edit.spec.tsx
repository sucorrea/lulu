import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import LulusCardEdit from './lulu-card-edit';
import type { Person } from '../types';

vi.mock('react-spinners/BounceLoader', () => ({
  default: vi.fn(() => <div data-testid="bounce-loader">Loading...</div>),
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: vi.fn(({ children, className }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  )),
  AvatarImage: vi.fn(({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="avatar-image"
      data-src={src}
      data-alt={alt}
      alt={alt || ''}
    />
  )),
  AvatarFallback: vi.fn(({ children }) => (
    <div data-testid="avatar-fallback">{children}</div>
  )),
}));

vi.mock('@/components/ui/card', () => ({
  Card: vi.fn(({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  )),
  CardContent: vi.fn(({ children, className }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  )),
}));

vi.mock('../edit-photo', () => ({
  default: vi.fn(({ participant }) => (
    <div data-testid="edit-photo" data-participant-id={participant.id}>
      Edit Photo
    </div>
  )),
}));

vi.mock('../form-edit-data/person-form', () => ({
  default: vi.fn(({ initialData }) => (
    <div data-testid="person-form" data-participant-name={initialData.name}>
      Person Form
    </div>
  )),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetParticipantById: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

const mockParticipant: Person = {
  id: 1,
  name: 'John Doe',
  fullName: 'John Doe',
  date: '1990-01-15',
  month: '1',
  photoURL: 'https://example.com/photo.jpg',
  email: 'john@example.com',
  phone: '1234567890',
  instagram: 'johndoe',
  pix_key: '12345678900',
  pix_key_type: 'cpf',
  city: 'São Paulo',
};

describe('LulusCardEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', async () => {
    const mod = await import('@/services/queries/fetchParticipants');
    vi.mocked(mod.useGetParticipantById).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof mod.useGetParticipantById>);

    await act(async () => {
      render(<LulusCardEdit participantId="1" />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('bounce-loader')).toBeInTheDocument();
    });
  });

  it('should render not found message when participant is null', async () => {
    const mod = await import('@/services/queries/fetchParticipants');
    vi.mocked(mod.useGetParticipantById).mockReturnValue({
      data: null,
      isLoading: false,
    } as unknown as ReturnType<typeof mod.useGetParticipantById>);

    await act(async () => {
      render(<LulusCardEdit participantId="1" />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Participante não encontrado.')
      ).toBeInTheDocument();
    });
  });

  it('should render participant card when data is available', async () => {
    const mod = await import('@/services/queries/fetchParticipants');
    vi.mocked(mod.useGetParticipantById).mockReturnValue({
      data: mockParticipant,
      isLoading: false,
    } as unknown as ReturnType<typeof mod.useGetParticipantById>);

    await act(async () => {
      render(<LulusCardEdit participantId="1" />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText(mockParticipant.name)).toBeInTheDocument();
    });
  });
});
