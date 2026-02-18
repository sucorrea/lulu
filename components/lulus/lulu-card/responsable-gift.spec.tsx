import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResponsableGift from './responsable-gift';
import type { Person } from '../types';

const mockUseGetOrganizerForParticipant = vi.fn();

vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useGetOrganizerForParticipant: (participantId: number) =>
    mockUseGetOrganizerForParticipant(participantId),
}));

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
  getParticipantPhotoUrl: vi.fn((participant: Person | null) => {
    return participant?.photoURL || null;
  }),
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: vi.fn(({ className }) => (
    <div data-testid="skeleton" className={className} />
  )),
}));

const mockParticipant = {
  id: 1,
  name: 'John Doe',
  date: '1990-01-15',
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

  describe('Loading state', () => {
    it('should render skeleton when isLoading is true', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: null,
        isLoading: true,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
      expect(
        screen.queryByText(/não participa da vaquinha esse ano/)
      ).not.toBeInTheDocument();
    });
  });

  describe('No Participation (no assignment)', () => {
    it('should render no participation message when assignment is null', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: null,
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(
        screen.getByText(/não participa da vaquinha esse ano/)
      ).toBeInTheDocument();
    });

    it('should not render avatar when assignment is null', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: null,
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
    });

    it('should apply correct text styling for no participation message', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: null,
        isLoading: false,
        isError: false,
      });

      const { container } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      const textElement = container.querySelector('p');
      expect(textElement).toHaveClass('text-primary');
      expect(textElement).toHaveClass('text-sm');
    });
  });

  describe('Participation (has assignment)', () => {
    it('should render avatar when assignment exists', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should render avatar image when organizer has photo', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    });

    it('should render avatar fallback when organizer has no photo', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 3,
          responsibleName: 'Bob Johnson',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it('should render organizer name', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    });

    it('should render responsible message text', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Responsável pela vaquinha')).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    });

    it('should apply correct avatar classes', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

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

    it('should render fallback with first letter of name', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 3,
          responsibleName: 'Bob Johnson',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('B');
    });

    it('should render no participation when organizer not found in participants', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 999,
          responsibleName: 'Unknown Person',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(
        screen.getByText(/não participa da vaquinha esse ano/)
      ).toBeInTheDocument();
    });
  });

  describe('useMemo Behavior', () => {
    it('should calculate responsable correctly from participants array', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    });

    it('should recalculate when participants array changes', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      const { rerender } = render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();

      const newParticipants = [
        mockParticipant,
        {
          id: 2,
          name: 'Updated Name',
          date: '1992-06-20',
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

      expect(screen.getByText(/Updated Name/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render no participation when participants array is empty', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift participant={mockParticipant} participants={[]} />
      );

      expect(
        screen.getByText(/não participa da vaquinha esse ano/)
      ).toBeInTheDocument();
    });

    it('should handle organizer with very long name', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      const longNameParticipants = [
        mockParticipant,
        {
          id: 2,
          name: 'A'.repeat(100),
          date: '1992-06-20',
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

      expect(screen.getByText(/A{100}/)).toBeInTheDocument();
    });

    it('should handle organizer with special characters in name', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: "João D'Silva",
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      const specialCharParticipants = [
        mockParticipant,
        {
          id: 2,
          name: "João D'Silva",
          date: '1992-06-20',
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

      expect(
        screen.getByText((content) => content.includes("João D'Silva"))
      ).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render with correct container class', () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

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
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

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
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

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
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

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
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: {
          id: 'assignment-1',
          year: 2026,
          responsibleId: 2,
          responsibleName: 'Jane Smith',
          birthdayPersonId: 1,
          birthdayPersonName: 'John Doe',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <ResponsableGift
          participant={mockParticipant}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Responsável pela vaquinha')).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    });
  });
});
