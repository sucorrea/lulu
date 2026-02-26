import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LulusCardEditContent from './lulu-card-edit-content';

const mockUseUserVerification = vi.fn();
const mockUseGetParticipantById = vi.fn();

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => mockUseUserVerification(),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetParticipantById: () => mockUseGetParticipantById(),
}));

vi.mock('react-spinners/BounceLoader', () => ({
  default: () => <div data-testid="bounce-loader">Loading...</div>,
}));

vi.mock('../edit-photo', () => ({
  default: ({ participant }: { participant: { name: string } }) => (
    <div data-testid="edit-photo">{participant.name}</div>
  ),
}));

vi.mock('../form-edit-data/person-form', () => ({
  default: ({ initialData }: { initialData: { name: string } }) => (
    <div data-testid="person-form">{initialData.name}</div>
  ),
}));

const mockParticipant = {
  id: 1,
  name: 'Ana Silva',
  fullName: 'Ana Silva Costa',
  date: '1990-05-15',
  month: 'Maio',
  photoURL: 'https://example.com/photo.jpg',
};

describe('LulusCardEditContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading spinner when data is loading', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: false });
      mockUseGetParticipantById.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(screen.getByTestId('bounce-loader')).toBeInTheDocument();
    });
  });

  describe('Not found state', () => {
    it('should show not found message when participant is null', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: false });
      mockUseGetParticipantById.mockReturnValue({
        data: null,
        isLoading: false,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(
        screen.getByText('Participante não encontrado.')
      ).toBeInTheDocument();
    });
  });

  describe('Normal render — non-admin', () => {
    it('should display participant name', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: false });
      mockUseGetParticipantById.mockReturnValue({
        data: mockParticipant,
        isLoading: false,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    });

    it('should NOT render EditPhoto or PersonForm for non-admin', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: false });
      mockUseGetParticipantById.mockReturnValue({
        data: mockParticipant,
        isLoading: false,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(screen.queryByTestId('edit-photo')).not.toBeInTheDocument();
      expect(screen.queryByTestId('person-form')).not.toBeInTheDocument();
    });
  });

  describe('Normal render — admin', () => {
    it('should render EditPhoto and PersonForm for admin', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: true });
      mockUseGetParticipantById.mockReturnValue({
        data: mockParticipant,
        isLoading: false,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(screen.getByTestId('edit-photo')).toBeInTheDocument();
      expect(screen.getByTestId('person-form')).toBeInTheDocument();
    });

    it('should show avatar fallback initial when photoURL is missing', () => {
      mockUseUserVerification.mockReturnValue({ isAdmin: true });
      mockUseGetParticipantById.mockReturnValue({
        data: { ...mockParticipant, photoURL: undefined },
        isLoading: false,
      });

      render(<LulusCardEditContent participantId="1" />);

      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });
});
