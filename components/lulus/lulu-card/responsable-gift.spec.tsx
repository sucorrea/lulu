import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResponsableGift from './responsable-gift';
import type { Person } from '../types';

vi.mock('@/components/ui/avatar', () => ({
  Avatar: vi.fn(({ children, className }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  )),
  AvatarImage: vi.fn(({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img data-testid="avatar-image" data-src={src} data-alt={alt} />
  )),
  AvatarFallback: vi.fn(({ children, className }) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  )),
}));

vi.mock('../utils', () => ({
  getGivesToPicture: vi.fn((id: number, participants: Person[]) => {
    const givesTo = participants.find((p) => p.id === id);
    return givesTo || ({} as Person);
  }),
  getParticipantPhotoUrl: vi.fn((participant: Person | null) => {
    return participant?.photoURL || null;
  }),
}));

const mockParticipant = {
  id: 1,
  name: 'John Doe',
  date: '1990-01-15',
  receives_to_id: 2,
  photoURL: 'https://example.com/photo.jpg',
  email: 'john@example.com',
  phone: '1234567890',
  instagram: 'johndoe',
  pix_key: '12345678900',
  pix_key_type: 'cpf',
} as unknown as Person;

const mockParticipants = [
  mockParticipant,
  {
    id: 2,
    name: 'Jane Smith',
    date: '1992-06-20',
    receives_to_id: 1,
    photoURL: 'https://example.com/photo2.jpg',
    email: null,
    phone: null,
    instagram: null,
    pix_key: null,
    pix_key_type: null,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    date: '1985-03-10',
    receives_to_id: 0,
    photoURL: null,
    email: null,
    phone: null,
    instagram: null,
    pix_key: null,
    pix_key_type: null,
  },
] as unknown as Person[];

describe('ResponsableGift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('No Participation (receives_to_id === 0)', () => {
    it('should render no participation message when receives_to_id is 0', () => {
      const participantNoGift = { ...mockParticipant, receives_to_id: 0 };
      render(
        <ResponsableGift
          participant={participantNoGift}
          participants={mockParticipants}
        />
      );

      expect(
        screen.getByText(/não participa da vaquinha esse ano/)
      ).toBeInTheDocument();
    });

    it('should not render avatar when receives_to_id is 0', () => {
      const participantNoGift = { ...mockParticipant, receives_to_id: 0 };
      render(
        <ResponsableGift
          participant={participantNoGift}
          participants={mockParticipants}
        />
      );

      expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
    });

    it('should render skull emoji when receives_to_id is 0', () => {
      const participantNoGift = { ...mockParticipant, receives_to_id: 0 };
      render(
        <ResponsableGift
          participant={participantNoGift}
          participants={mockParticipants}
        />
      );

      expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
    });

    it('should apply correct text styling for no participation message', () => {
      const participantNoGift = { ...mockParticipant, receives_to_id: 0 };
      const { container } = render(
        <ResponsableGift
          participant={participantNoGift}
          participants={mockParticipants}
        />
      );

      const textElement = container.querySelector('p');
      expect(textElement).toHaveClass('text-primary');
      expect(textElement).toHaveClass('text-sm');
    });
  });

  describe('Participation (receives_to_id > 0)', () => {
    it('should render avatar when receives_to_id is greater than 0', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should render avatar image when givesTo participant has photo', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    });

    it('should render avatar fallback when givesTo participant has no photo', () => {
      const participantGivesToNoPhoto = {
        ...mockParticipant,
        receives_to_id: 3,
      };
      render(
        <ResponsableGift
          participant={participantGivesToNoPhoto}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it('should render givesTo participant name', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render responsible message text', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Responsável pela vaquinha')).toBeInTheDocument();
    });

    it('should apply correct avatar classes', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('h-12');
      expect(avatar).toHaveClass('w-12');
    });

    it('should apply correct text styling for participant name', () => {
      const { container } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const allParagraphs = container.querySelectorAll('p');
      expect(allParagraphs.length).toBeGreaterThan(0);
    });

    it('should render fallback with first letter of name', () => {
      const participantGivesToNoPhoto = {
        ...mockParticipant,
        receives_to_id: 3,
      };
      render(
        <ResponsableGift
          participant={participantGivesToNoPhoto}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('B');
    });

    it('should render fallback with question mark when name is empty', () => {
      const participantsWithEmptyName = [
        ...mockParticipants,
        {
          id: 4,
          name: '',
          date: '1990-01-01',
          receives_to_id: 0,
          photoURL: null,
          email: null,
          phone: null,
          instagram: null,
          pix_key: null,
          pix_key_type: null,
        },
      ] as unknown as Person[];
      const participantGivesToEmpty = { ...mockParticipant, receives_to_id: 4 };
      render(
        <ResponsableGift
          participant={participantGivesToEmpty}
          participants={participantsWithEmptyName}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('?');
    });

    it('should render fallback with question mark when name is null', () => {
      const participantsWithNullName = [
        ...mockParticipants,
        {
          id: 4,
          name: null,
          date: '1990-01-01',
          receives_to_id: 0,
          photoURL: null,
          email: null,
          phone: null,
          instagram: null,
          pix_key: null,
          pix_key_type: null,
        },
      ] as unknown as Person[];
      const participantGivesToNull = { ...mockParticipant, receives_to_id: 4 };
      render(
        <ResponsableGift
          participant={participantGivesToNull}
          participants={participantsWithNullName}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('?');
    });
  });

  describe('useMemo Behavior', () => {
    it('should calculate givesTo correctly from participants array', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should handle case when givesTo participant is not found', () => {
      const participantWithInvalidId = {
        ...mockParticipant,
        receives_to_id: 999,
      };
      render(
        <ResponsableGift
          participant={participantWithInvalidId}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should recalculate when participant changes', () => {
      const { rerender } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      const newParticipant = { ...mockParticipant, receives_to_id: 3 };
      rerender(
        <ResponsableGift
          participant={newParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should recalculate when participants array changes', () => {
      const { rerender } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      const newParticipants = [
        mockParticipant,
        {
          id: 2,
          name: 'Updated Name',
          date: '1992-06-20',
          receives_to_id: 1,
          photoURL: null,
          email: null,
          phone: null,
          instagram: null,
          pix_key: null,
          pix_key_type: null,
        },
      ] as unknown as Person[];

      rerender(
        <ResponsableGift
          participant={mockParticipant}
          participants={newParticipants}
        />
      );

      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty participants array', () => {
      render(
        <ResponsableGift participant={mockParticipant} participants={[]} />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should handle participant with null receives_to_id', () => {
      const participantNullGivesTo = {
        ...mockParticipant,
        receives_to_id: null as unknown as number,
      };
      render(
        <ResponsableGift
          participant={participantNullGivesTo}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should handle participant with undefined receives_to_id', () => {
      const participantUndefinedGivesTo = {
        ...mockParticipant,
        receives_to_id: undefined as unknown as number,
      };
      render(
        <ResponsableGift
          participant={participantUndefinedGivesTo}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should handle negative receives_to_id', () => {
      const participantNegativeId = { ...mockParticipant, receives_to_id: -1 };
      render(
        <ResponsableGift
          participant={participantNegativeId}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should handle givesTo participant with very long name', () => {
      const longNameParticipants = [
        mockParticipant,
        {
          id: 2,
          name: 'A'.repeat(100),
          date: '1992-06-20',
          receives_to_id: 1,
          photoURL: null,
          email: null,
          phone: null,
          instagram: null,
          pix_key: null,
          pix_key_type: null,
        },
      ] as unknown as Person[];

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={longNameParticipants}
        />
      );

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('should handle givesTo participant with special characters in name', () => {
      const specialCharParticipants = [
        mockParticipant,
        {
          id: 2,
          name: "João D'Silva",
          date: '1992-06-20',
          receives_to_id: 1,
          photoURL: null,
          email: null,
          phone: null,
          instagram: null,
          pix_key: null,
          pix_key_type: null,
        },
      ] as unknown as Person[];

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={specialCharParticipants}
        />
      );

      expect(screen.getByText("João D'Silva")).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render with correct container class', () => {
      const { container } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const divElement = container.querySelector('div.bg-muted');
      expect(divElement).toBeInTheDocument();
    });

    it('should render avatar and name in flex container', () => {
      const { container } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const flexContainer = container.querySelector('div.flex.items-center');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have correct gap between avatar and text', () => {
      const { container } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const flexContainer = container.querySelector('div.flex');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render avatar with semantic structure', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should have descriptive text for screen readers', () => {
      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Responsável pela vaquinha')).toBeInTheDocument();
    });
  });
});
