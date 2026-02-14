import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PixInfo from './pix-info';
import { Person } from './lulus/types';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

const mockUseIsMobile = vi.fn();

vi.mock('@/providers/device-provider', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

vi.mock('./lulus/utils', () => ({
  NameKey: {
    cpf: 'CPF',
    email: 'Email',
    phone: 'Celular',
    random: 'Aleatório',
    none: 'Nenhum',
  },
}));

describe('PixInfo', () => {
  const mockParticipant: Person = {
    id: 1,
    name: 'Alice',
    fullName: 'Alice Johnson',
    date: '1990-01-15',
    month: '01',
    receives_to_id: 2,
    city: 'São Paulo',
    pix_key: '123.456.789-00',
    pix_key_type: 'cpf',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsMobile.mockReturnValue({ isMobile: false });
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    globalThis.alert = vi.fn();
  });

  it('should render pix icon', () => {
    render(<PixInfo participant={mockParticipant} />);

    const pixIcon = screen.getByAltText('Pix');
    expect(pixIcon).toBeInTheDocument();
    expect(pixIcon).toHaveAttribute('src', '/pix.svg');
  });

  it('should render pix key type label', () => {
    render(<PixInfo participant={mockParticipant} />);

    expect(screen.getByText('CPF')).toBeInTheDocument();
  });

  it('should render pix key value', () => {
    render(<PixInfo participant={mockParticipant} />);

    expect(screen.getByText(': 123.456.789-00')).toBeInTheDocument();
  });

  it('should copy pix key to clipboard on button click', async () => {
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '123.456.789-00'
    );
  });

  it('should show alert on desktop when copying', () => {
    mockUseIsMobile.mockReturnValue({ isMobile: false });
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(globalThis.alert).toHaveBeenCalledWith(
      'QRCode copiado com sucesso!'
    );
  });

  it('should not show alert on mobile when copying', () => {
    mockUseIsMobile.mockReturnValue({ isMobile: true });
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(globalThis.alert).not.toHaveBeenCalled();
  });

  it('should render with email pix key type', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key_type: 'email',
      pix_key: 'test@example.com',
    };

    render(<PixInfo participant={participant} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText(': test@example.com')).toBeInTheDocument();
  });

  it('should render with phone pix key type', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key_type: 'phone',
      pix_key: '11999999999',
    };

    render(<PixInfo participant={participant} />);

    expect(screen.getByText('Celular')).toBeInTheDocument();
    expect(screen.getByText(': 11999999999')).toBeInTheDocument();
  });

  it('should render with random pix key type', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key_type: 'random',
      pix_key: 'abc-123-def-456',
    };

    render(<PixInfo participant={participant} />);

    expect(screen.getByText('Aleatório')).toBeInTheDocument();
    expect(screen.getByText(': abc-123-def-456')).toBeInTheDocument();
  });

  it('should render with none pix key type when undefined', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key_type: undefined,
      pix_key: '',
    };

    render(<PixInfo participant={participant} />);

    expect(screen.getByText('Nenhum')).toBeInTheDocument();
  });

  it('should apply correct styling to container', () => {
    const { container } = render(<PixInfo participant={mockParticipant} />);

    const mainDiv = container.querySelector('.flex.text-xs');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should apply correct styling to button', () => {
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'text-xs',
      'bg-transparent',
      'border-0',
      'p-0',
      'cursor-pointer',
      'hover:underline'
    );
  });

  it('should have gap-1 between icon and text', () => {
    const { container } = render(<PixInfo participant={mockParticipant} />);

    const innerDiv = container.querySelector('.flex.gap-1');
    expect(innerDiv).toBeInTheDocument();
  });

  it('should render pix icon with correct dimensions', () => {
    render(<PixInfo participant={mockParticipant} />);

    const pixIcon = screen.getByAltText('Pix');
    expect(pixIcon).toHaveAttribute('width', '20');
    expect(pixIcon).toHaveAttribute('height', '20');
  });

  it('should copy empty string when pix_key is undefined', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key: undefined,
    };

    render(<PixInfo participant={participant} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
  });

  it('should handle none pix key type', () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key_type: 'none',
      pix_key: '',
    };

    render(<PixInfo participant={participant} />);

    expect(screen.getByText('Nenhum')).toBeInTheDocument();
  });
});
