/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import LulusCardHome from './lulu-card-home';
import type { Person } from '../types';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from '../constants';

const mockUseGetOrganizerForParticipant = vi.fn();

vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useGetOrganizerForParticipant: (participantId: number) =>
    mockUseGetOrganizerForParticipant(participantId),
}));

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, unoptimized }) => (
    <img
      data-testid="next-image"
      data-unoptimized={String(Boolean(unoptimized))}
      src={src}
      alt={alt}
    />
  )),
}));

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href, className, ...rest }) => (
    <a
      href={href}
      className={className}
      aria-label={rest['aria-label']}
      target={rest.target}
    >
      {children}
    </a>
  )),
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: vi.fn(({ children }) => <div>{children}</div>),
  Tooltip: vi.fn(({ children }) => <div>{children}</div>),
  TooltipTrigger: vi.fn(({ children }) => <div>{children}</div>),
  TooltipContent: vi.fn(({ children }) => (
    <div data-testid="tooltip-content">{children}</div>
  )),
}));

vi.mock('../../pix-info', () => ({
  default: vi.fn(() => <div data-testid="pix-info">Pix Info</div>),
}));

vi.mock('../../qrcode-pix', () => ({
  default: vi.fn(() => <div data-testid="qrcode-pix">QR Code</div>),
}));

vi.mock('../../whatsapp-info', () => ({
  default: vi.fn(() => <div data-testid="whatsapp-info">Whatsapp Info</div>),
}));

const mockParticipant = {
  id: 1,
  editToken: 'encrypted-1',
  name: 'John Doe',
  date: '1990-01-15',
  month: '01',
  photoURL: 'https://res.cloudinary.com/demo/photo.jpg',
  phone: '1234567890',
  instagram: 'johndoe',
  pix_key: '12345678900',
  pix_key_type: 'cpf',
} as unknown as Person;

const organizer = {
  id: 2,
  name: 'Jane Smith',
  date: '1992-06-20',
  month: '06',
} as unknown as Person;

const mockParticipants: Person[] = [mockParticipant, organizer];

const renderCard = (props: Partial<Parameters<typeof LulusCardHome>[0]> = {}) =>
  render(
    <LulusCardHome
      participant={mockParticipant}
      participants={mockParticipants}
      user={false}
      daysUntil={53}
      {...props}
    />
  );

describe('LulusCardHome', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 18, 12));
    vi.clearAllMocks();
    mockUseGetOrganizerForParticipant.mockReturnValue({
      assignment: { responsibleId: 2 },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('featured variant', () => {
    it('should show the plural days label', () => {
      renderCard({ variant: 'featured', daysUntil: 9 });

      expect(
        screen.getByText('Próxima aniversariante · faltam 9 dias')
      ).toBeInTheDocument();
    });

    it('should show the today label', () => {
      renderCard({ variant: 'featured', daysUntil: 0 });

      expect(
        screen.getByText('Próxima aniversariante · é hoje!')
      ).toBeInTheDocument();
    });

    it('should show the singular days label', () => {
      renderCard({ variant: 'featured', daysUntil: 1 });

      expect(
        screen.getByText('Próxima aniversariante · falta 1 dia')
      ).toBeInTheDocument();
    });

    it('should show the responsible and the more info accordion', async () => {
      renderCard({ variant: 'featured', daysUntil: 9 });

      expect(
        await screen.findByText('Responsável pela vaquinha')
      ).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Ver mais informações')).toBeInTheDocument();
    });

    it('should render the large decorative photo next to the visible name', () => {
      renderCard({ variant: 'featured', daysUntil: 9 });

      const photo = screen.getByTestId('featured-photo');
      const image = within(photo).getByTestId('next-image');
      expect(image).toHaveAttribute('src', mockParticipant.photoURL);
      expect(image).toHaveAttribute('alt', '');
      expect(
        within(photo).getByRole('heading', { name: 'John Doe' })
      ).toBeInTheDocument();
    });

    it('should show date, sign and instagram over the photo', () => {
      renderCard({ variant: 'featured', daysUntil: 9 });

      const photo = screen.getByTestId('featured-photo');
      expect(within(photo).getByText('15/01')).toBeInTheDocument();
      expect(within(photo).getByText('Capricórnio')).toBeInTheDocument();
      expect(within(photo).getByText('@johndoe').closest('a')).toHaveAttribute(
        'href',
        `${LINK_INSTAGRAM}johndoe`
      );
    });

    it('should optimize Cloudinary photos and skip optimization for other hosts', () => {
      const { unmount } = renderCard({
        variant: 'featured',
        daysUntil: 9,
        participant: {
          ...mockParticipant,
          photoURL: 'https://res.cloudinary.com/demo/image/upload/a.jpg',
        },
      });
      expect(screen.getByTestId('next-image')).toHaveAttribute(
        'data-unoptimized',
        'false'
      );
      unmount();

      renderCard({
        variant: 'featured',
        daysUntil: 9,
        participant: {
          ...mockParticipant,
          photoURL: 'https://lh3.googleusercontent.com/a.jpg',
        },
      });
      expect(screen.getByTestId('next-image')).toHaveAttribute(
        'data-unoptimized',
        'true'
      );
    });

    it('should show the initial instead of a broken image without photo', () => {
      renderCard({
        variant: 'featured',
        daysUntil: 9,
        participant: { ...mockParticipant, photoURL: undefined },
      });

      const photo = screen.getByTestId('featured-photo');
      expect(within(photo).queryByRole('img')).not.toBeInTheDocument();
      expect(within(photo).queryByTestId('next-image')).not.toBeInTheDocument();
      expect(within(photo).getByText('J')).toBeInTheDocument();
    });

    it('should not show the days counter column', () => {
      renderCard({ variant: 'featured', daysUntil: 9 });

      expect(screen.queryByTestId('days-until')).not.toBeInTheDocument();
    });

    it('should show the edit link for admin', () => {
      renderCard({ variant: 'featured', daysUntil: 9, user: true });

      expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
        'href',
        'participantes/encrypted-1'
      );
    });
  });

  describe('default variant', () => {
    it('should show the number of days with plural label', () => {
      renderCard({ daysUntil: 53 });

      const counter = screen.getByTestId('days-until');
      expect(within(counter).getByText('53')).toBeInTheDocument();
      expect(within(counter).getByText('dias')).toBeInTheDocument();
    });

    it('should show singular label for one day', () => {
      renderCard({ daysUntil: 1 });

      const counter = screen.getByTestId('days-until');
      expect(within(counter).getByText('1')).toBeInTheDocument();
      expect(within(counter).getByText('dia')).toBeInTheDocument();
    });

    it('should show Hoje! for zero days', () => {
      renderCard({ daysUntil: 0 });

      const counter = screen.getByTestId('days-until');
      expect(within(counter).getByText('Hoje!')).toBeInTheDocument();
      expect(within(counter).queryByText('dias')).not.toBeInTheDocument();
    });

    it('should render the name as a heading', () => {
      renderCard();

      expect(
        screen.getByRole('heading', { name: 'John Doe' })
      ).toBeInTheDocument();
    });

    it('should not render the featured photo or label', () => {
      renderCard();

      expect(screen.queryByTestId('featured-photo')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Próxima aniversariante/)
      ).not.toBeInTheDocument();
    });

    it('should show the instagram link and the accordion', () => {
      renderCard();

      expect(screen.getByText('@johndoe').closest('a')).toHaveAttribute(
        'href',
        `${LINK_INSTAGRAM}johndoe`
      );
      expect(screen.getByText('Ver mais informações')).toBeInTheDocument();
    });

    it('should link the sign to the horoscope', () => {
      renderCard();

      expect(screen.getByText('Capricórnio').closest('a')).toHaveAttribute(
        'href',
        `${LINK_HOROSCOPO_DIARIO}capricornio/`
      );
    });

    it('should not show instagram when missing', () => {
      renderCard({ participant: { ...mockParticipant, instagram: '' } });

      expect(screen.queryByText('@johndoe')).not.toBeInTheDocument();
    });

    it('should show whatsapp, pix and qrcode when opening the accordion', () => {
      renderCard();

      fireEvent.click(screen.getByText('Ver mais informações'));

      expect(screen.getByTestId('whatsapp-info')).toBeInTheDocument();
      expect(screen.getByTestId('pix-info')).toBeInTheDocument();
      expect(screen.getByTestId('qrcode-pix')).toBeInTheDocument();
    });

    it('should hide whatsapp and pix when the data is missing', () => {
      renderCard({
        participant: {
          ...mockParticipant,
          phone: undefined,
          pix_key: undefined,
        },
      });

      fireEvent.click(screen.getByText('Ver mais informações'));

      expect(screen.queryByTestId('whatsapp-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pix-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('qrcode-pix')).not.toBeInTheDocument();
    });

    it('should show the responsible block', async () => {
      renderCard();

      expect(
        await screen.findByText('Responsável pela vaquinha')
      ).toBeInTheDocument();
    });

    it('should show the no participation message without responsible', async () => {
      mockUseGetOrganizerForParticipant.mockReturnValue({
        assignment: null,
        isLoading: false,
        isError: false,
      });
      renderCard();

      expect(
        await screen.findByText('Não participa da vaquinha este ano')
      ).toBeInTheDocument();
    });

    it('should show the avatar initial', () => {
      renderCard({
        participant: { ...mockParticipant, name: 'zoe', photoURL: undefined },
      });

      expect(screen.getByText('Z')).toBeInTheDocument();
    });

    it('should show question mark without name', () => {
      renderCard({
        participant: {
          ...mockParticipant,
          name: '',
          photoURL: undefined,
        },
      });

      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });

  describe('admin edit link', () => {
    it('should show the edit link with the encrypted token', () => {
      renderCard({ user: true });

      expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
        'href',
        'participantes/encrypted-1'
      );
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent('Editar');
    });

    it('should fall back to the id without token', () => {
      renderCard({
        user: true,
        participant: { ...mockParticipant, editToken: undefined },
      });

      expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
        'href',
        'participantes/1'
      );
    });

    it('should not show the edit link for non admin', () => {
      renderCard({ user: false });

      expect(
        screen.queryByRole('link', { name: 'Editar' })
      ).not.toBeInTheDocument();
    });
  });
});
