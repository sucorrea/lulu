/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import LulusCardHome from './lulu-card-home';
import type { Person } from '../types';

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, width, height }) => (
    <img
      data-testid="next-image"
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  )),
}));

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href, title, className }) => (
    <a data-testid="next-link" href={href} title={title} className={className}>
      {children}
    </a>
  )),
}));

vi.mock('@iconify/react', () => ({
  Icon: vi.fn(({ icon }) => (
    <div data-testid="iconify-icon" data-icon={icon} />
  )),
}));

vi.mock('lucide-react', () => ({
  CakeIcon: vi.fn(({ size, className }) => (
    <div data-testid="cake-icon" data-size={size} className={className} />
  )),
  Edit2Icon: vi.fn(({ size, className }) => (
    <div data-testid="edit-icon" data-size={size} className={className} />
  )),
  GiftIcon: vi.fn(({ size, className }) => (
    <div data-testid="gift-icon" data-size={size} className={className} />
  )),
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: vi.fn(({ children, className }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  )),
  AvatarImage: vi.fn(({ src, alt }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img data-testid="avatar-image" data-src={src} data-alt={alt} />
  )),
  AvatarFallback: vi.fn(({ children, className }) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
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

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: vi.fn(({ children }) => (
    <div data-testid="tooltip-provider">{children}</div>
  )),
  Tooltip: vi.fn(({ children }) => <div data-testid="tooltip">{children}</div>),
  TooltipTrigger: vi.fn(({ children, asChild }) => (
    <div data-testid="tooltip-trigger" data-as-child={asChild}>
      {children}
    </div>
  )),
  TooltipContent: vi.fn(({ children }) => (
    <div data-testid="tooltip-content">{children}</div>
  )),
}));

vi.mock('../../pix-info', () => ({
  default: vi.fn(({ participant }) => (
    <div data-testid="pix-info" data-pix-key={participant.pix_key}>
      Pix Info
    </div>
  )),
}));

vi.mock('../../qrcode-pix', () => ({
  default: vi.fn(({ participant }) => (
    <div data-testid="qrcode-pix" data-pix-key={participant.pix_key}>
      QR Code
    </div>
  )),
}));

vi.mock('../../whatsapp-info', () => ({
  default: vi.fn(({ participant }) => (
    <div data-testid="whatsapp-info" data-phone={participant.phone}>
      Whatsapp Info
    </div>
  )),
}));

vi.mock('../link-with-icon', () => ({
  default: vi.fn(({ link, text, icon, showDescription }) => (
    <div
      data-testid="link-with-icon"
      data-link={link}
      data-text={text}
      data-show-description={showDescription}
    >
      {icon}
      {text}
    </div>
  )),
}));

vi.mock('../more-info', () => ({
  default: vi.fn(({ children }) => (
    <div data-testid="more-info-accordion">{children}</div>
  )),
}));

vi.mock('./responsable-gift', () => ({
  default: vi.fn(({ participant, participants }) => (
    <div
      data-testid="responsable-gift"
      data-participant-id={participant.id}
      data-participants-count={participants.length}
    >
      Responsable Gift
    </div>
  )),
}));

vi.mock('@/components/animation', () => ({
  default: vi.fn(({ className }) => (
    <div data-testid="animation" className={className}>
      Animation
    </div>
  )),
}));

const isDaysLabel = (content: string): boolean => {
  const trimmed = content.trim();
  const parts = trimmed.split(/\s+/u);

  if (parts.length !== 2) {
    return false;
  }

  const [numberText, label] = parts;
  const value = Number(numberText);

  return (
    Number.isInteger(value) &&
    value >= 0 &&
    (label === 'dia' || label === 'dias')
  );
};

const mockParticipant = {
  id: 1,
  editToken: 'encrypted-1',
  name: 'John Doe',
  date: '1990-01-15',
  photoURL: 'https://example.com/photo.jpg',
  receives_to_id: 2,
  email: 'john@example.com',
  phone: '1234567890',
  instagram: 'johndoe',
  pix_key: '12345678900',
  pix_key_type: 'cpf',
} as unknown as Person;

const mockParticipants: Person[] = [
  mockParticipant,
  {
    id: 2,
    name: 'Jane Smith',
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

describe('LulusCardHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render card component', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
    });

    it('should render participant name', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render avatar with participant photo', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toBeInTheDocument();
    });

    it('should render avatar fallback with first letter', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('J');
    });

    it('should render avatar fallback with question mark when name is empty', () => {
      const participantWithoutName = { ...mockParticipant, name: '' };
      render(
        <LulusCardHome
          participant={participantWithoutName}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('?');
    });

    it('should render avatar fallback with question mark when name is null', () => {
      const participantWithoutName = {
        ...mockParticipant,
        name: null,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutName}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('?');
    });
  });

  describe('Next Birthday Banner', () => {
    it('should render next birthday banner when isNextBirthday is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={true}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('Próxima Aniversariante')).toBeInTheDocument();
      expect(screen.getByTestId('gift-icon')).toBeInTheDocument();
      expect(screen.getByTestId('animation')).toBeInTheDocument();
    });

    it('should not render next birthday banner when isNextBirthday is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(
        screen.queryByText('Próxima aniversariante')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('gift-icon')).not.toBeInTheDocument();
    });

    it('should display singular "dia" when 1 day until birthday', () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowParticipant = {
        ...mockParticipant,
        date: `${today.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`,
      };

      render(
        <LulusCardHome
          participant={tomorrowParticipant}
          isNextBirthday={true}
          user={false}
          participants={[tomorrowParticipant]}
        />
      );

      const texts = screen.queryAllByText(/até o grande dia!/);
      expect(texts.length).toBeGreaterThan(0);
    });

    it('should display plural "dias" when multiple days until birthday', () => {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 5);
      const futureParticipant = {
        ...mockParticipant,
        date: `${today.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`,
      };

      render(
        <LulusCardHome
          participant={futureParticipant}
          isNextBirthday={true}
          user={false}
          participants={[futureParticipant]}
        />
      );

      expect(
        screen.getByText((content) => isDaysLabel(content))
      ).toBeInTheDocument();
      expect(screen.getByText('até o grande dia!')).toBeInTheDocument();
    });
  });

  describe('Card Styling', () => {
    it('should apply next birthday border style when isNextBirthday is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={true}
          user={false}
          participants={mockParticipants}
        />
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-primary');
      expect(card).toHaveClass('border-2');
      expect(card).toHaveClass('shadow-lulu-lg');
    });

    it('should apply default shadow style when isNextBirthday is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-lulu-sm');
    });

    it('should have lulu-card class', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('lulu-card');
    });
  });

  describe('User Edit Link', () => {
    it('should render edit link when user is true and showDetails is true', () => {
      render(
        <TooltipProvider>
          <LulusCardHome
            participant={mockParticipant}
            isNextBirthday={false}
            user={true}
            participants={mockParticipants}
            showDetails={true}
          />
        </TooltipProvider>
      );

      expect(screen.getByTestId('next-link')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    });

    it('should not render edit link when user is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
    });

    it('should not render edit link when showDetails is false', () => {
      render(
        <TooltipProvider>
          <LulusCardHome
            participant={mockParticipant}
            isNextBirthday={false}
            user={true}
            participants={mockParticipants}
            showDetails={false}
          />
        </TooltipProvider>
      );

      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
    });

    it('should generate correct edit link with encrypted ID', () => {
      render(
        <TooltipProvider>
          <LulusCardHome
            participant={mockParticipant}
            isNextBirthday={false}
            user={true}
            participants={mockParticipants}
          />
        </TooltipProvider>
      );

      const link = screen.getByTestId('next-link');
      expect(link).toHaveAttribute('href', 'participantes/encrypted-1');
    });

    it('should render tooltip components when user is true and showDetails is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={true}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('should render tooltip content with "Editar" text', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={true}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent('Editar');
    });

    it('should set asChild prop to true on TooltipTrigger', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={true}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      const tooltipTrigger = screen.getByTestId('tooltip-trigger');
      expect(tooltipTrigger).toHaveAttribute('data-as-child', 'true');
    });

    it('should not render tooltip components when user is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tooltip-trigger')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
    });

    it('should not render tooltip components when showDetails is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={true}
          participants={mockParticipants}
          showDetails={false}
        />
      );

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tooltip-trigger')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
    });
  });

  describe('Participant Information', () => {
    it('should render cake icon', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('cake-icon')).toBeInTheDocument();
    });

    it('should render zodiac sign icon', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('iconify-icon')).toBeInTheDocument();
    });

    it('should render instagram link when instagram is provided', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getAllByTestId('link-with-icon')).toHaveLength(2);
    });

    it('should not render instagram link when instagram is null', () => {
      const participantWithoutInstagram = {
        ...mockParticipant,
        instagram: null,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutInstagram}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getAllByTestId('link-with-icon')).toHaveLength(1);
    });

    it('should not render instagram link when instagram is undefined', () => {
      const participantWithoutInstagram = {
        ...mockParticipant,
        instagram: undefined,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutInstagram}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getAllByTestId('link-with-icon')).toHaveLength(1);
    });

    it('should not render instagram link when instagram is empty string', () => {
      const participantWithoutInstagram = {
        ...mockParticipant,
        instagram: '',
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutInstagram}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getAllByTestId('link-with-icon')).toHaveLength(1);
    });
  });

  describe('showDetails Prop', () => {
    it('should render details section when showDetails is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.getByTestId('more-info-accordion')).toBeInTheDocument();
      expect(screen.getByTestId('responsable-gift')).toBeInTheDocument();
    });

    it('should not render details section when showDetails is false', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={false}
        />
      );

      expect(
        screen.queryByTestId('more-info-accordion')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('responsable-gift')).not.toBeInTheDocument();
    });

    it('should default showDetails to true when not provided', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByTestId('more-info-accordion')).toBeInTheDocument();
    });

    it('should render phone info when phone is provided and showDetails is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.getByTestId('whatsapp-info')).toBeInTheDocument();
    });

    it('should not render phone info when phone is null', () => {
      const participantWithoutPhone = {
        ...mockParticipant,
        phone: null,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutPhone}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.queryByTestId('whatsapp-info')).not.toBeInTheDocument();
    });

    it('should render pix info when pix_key is provided and showDetails is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.getByTestId('pix-info')).toBeInTheDocument();
    });

    it('should not render pix info when pix_key is null', () => {
      const participantWithoutPix = {
        ...mockParticipant,
        pix_key: null,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutPix}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.queryByTestId('pix-info')).not.toBeInTheDocument();
    });

    it('should render pix qrcode when pix_key is provided and showDetails is true', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.getByTestId('qrcode-pix')).toBeInTheDocument();
    });

    it('should not render pix qrcode when pix_key is null', () => {
      const participantWithoutPix = {
        ...mockParticipant,
        pix_key: null,
      } as unknown as Person;
      render(
        <LulusCardHome
          participant={participantWithoutPix}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={true}
        />
      );

      expect(screen.queryByTestId('qrcode-pix')).not.toBeInTheDocument();
    });
  });

  describe('calculateDaysUntilBirthday', () => {
    it('should calculate days correctly for birthday in current year', () => {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 10);
      const futureParticipant = {
        ...mockParticipant,
        date: `${today.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`,
      };

      render(
        <LulusCardHome
          participant={futureParticipant}
          isNextBirthday={true}
          user={false}
          participants={[futureParticipant]}
        />
      );

      expect(
        screen.getByText((content) => isDaysLabel(content))
      ).toBeInTheDocument();
      expect(screen.getByText('até o grande dia!')).toBeInTheDocument();
    });

    it('should calculate days correctly when birthday has passed this year', () => {
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 10);
      const pastParticipant = {
        ...mockParticipant,
        date: `${today.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDate.getDate()).padStart(2, '0')}`,
      };

      render(
        <LulusCardHome
          participant={pastParticipant}
          isNextBirthday={true}
          user={false}
          participants={[pastParticipant]}
        />
      );

      expect(
        screen.getByText((content) => isDaysLabel(content))
      ).toBeInTheDocument();
      expect(screen.getByText('até o grande dia!')).toBeInTheDocument();
    });
  });

  describe('ResponsableGift Component', () => {
    it('should render responsable gift component with correct props', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const responsableGift = screen.getByTestId('responsable-gift');
      expect(responsableGift).toHaveAttribute(
        'data-participant-id',
        String(mockParticipant.id)
      );
      expect(responsableGift).toHaveAttribute(
        'data-participants-count',
        String(mockParticipants.length)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle participant with minimal data', () => {
      const minimalParticipant: Person = {
        id: 1,
        name: 'Min User',
        date: '1990-01-01',
        receives_to_id: 0,
        photoURL: null,
        email: null,
        phone: null,
        instagram: null,
        pix_key: null,
        pix_key_type: null,
      } as unknown as Person;

      render(
        <LulusCardHome
          participant={minimalParticipant}
          isNextBirthday={false}
          user={false}
          participants={[minimalParticipant]}
        />
      );

      expect(screen.getByText('Min User')).toBeInTheDocument();
    });

    it('should handle empty participants array', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={[]}
        />
      );

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should handle participant with all optional fields undefined', () => {
      const participantUndefined: Person = {
        id: 1,
        name: 'Test User',
        date: '1990-01-01',
        receives_to_id: 0,
        photoURL: undefined,
        email: undefined,
        phone: undefined,
        instagram: undefined,
        pix_key: undefined,
        pix_key_type: undefined,
      } as unknown as Person;

      render(
        <LulusCardHome
          participant={participantUndefined}
          isNextBirthday={false}
          user={false}
          participants={[participantUndefined]}
        />
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should handle very long participant name', () => {
      const longNameParticipant = {
        ...mockParticipant,
        name: 'A'.repeat(100),
      };

      render(
        <LulusCardHome
          participant={longNameParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });
  });

  describe('Layout Classes', () => {
    it('should have correct avatar classes', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('h-20');
      expect(avatar).toHaveClass('w-20');
      expect(avatar).toHaveClass('border-4');
      expect(avatar).toHaveClass('border-primary/20');
    });

    it('should have correct card classes', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
        />
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('mx-auto');
      expect(card).toHaveClass('w-full');
      expect(card).toHaveClass('max-w-md');
    });
  });

  describe('Combined Props Scenarios', () => {
    it('should render correctly with isNextBirthday and user both true', () => {
      render(
        <TooltipProvider>
          <LulusCardHome
            participant={mockParticipant}
            isNextBirthday={true}
            user={true}
            participants={mockParticipants}
            showDetails={true}
          />
        </TooltipProvider>
      );

      expect(screen.getByText('Próxima Aniversariante')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('more-info-accordion')).toBeInTheDocument();
    });

    it('should render correctly with all props false except required', () => {
      render(
        <LulusCardHome
          participant={mockParticipant}
          isNextBirthday={false}
          user={false}
          participants={mockParticipants}
          showDetails={false}
        />
      );

      expect(
        screen.queryByText('Próxima aniversariante')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('more-info-accordion')
      ).not.toBeInTheDocument();
    });
  });
});
