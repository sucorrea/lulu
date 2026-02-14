import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PixQRCode from './qrcode-pix';
import { Person } from './lulus/types';

const mockQrCodePixPayload = vi.fn();

vi.mock('qrcode-pix', () => ({
  QrCodePix: (config: {
    version: string;
    key: string;
    name: string;
    city: string;
    transactionId: string;
  }) => {
    return {
      payload: () => mockQrCodePixPayload(config),
    };
  },
}));

vi.mock('qrcode.react', () => ({
  QRCodeCanvas: ({
    value,
    size,
    style,
    onClick,
  }: {
    value: string;
    size: number;
    style: React.CSSProperties;
    onClick: () => void;
  }) => (
    <button
      type="button"
      data-testid="qrcode-canvas"
      data-value={value}
      data-size={size}
      style={style}
      onClick={onClick}
    />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    variant,
    className,
    children,
  }: {
    onClick?: () => void;
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      className={className}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

const mockUseIsMobile = vi.fn();
const mockOnToggle = vi.fn();
const mockUseDisclosure = vi.fn();

vi.mock('@/providers/device-provider', () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: () => mockUseDisclosure(),
}));

describe('PixQRCode', () => {
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
    mockUseDisclosure.mockReturnValue({
      isOpen: false,
      onToggle: mockOnToggle,
    });
    mockQrCodePixPayload.mockReturnValue('mock-payload-string');
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    globalThis.alert = vi.fn();
  });

  it('should render toggle button with closed state text', () => {
    render(<PixQRCode participant={mockParticipant} />);

    expect(screen.getByText('mostrar QRCode Pix de Alice')).toBeInTheDocument();
  });

  it('should call onToggle when button is clicked', () => {
    render(<PixQRCode participant={mockParticipant} />);

    const button = screen.getAllByTestId('button')[0];
    fireEvent.click(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should generate QR code payload on mount', async () => {
    render(<PixQRCode participant={mockParticipant} />);

    await waitFor(() => {
      expect(mockQrCodePixPayload).toHaveBeenCalledWith({
        version: '01',
        key: '123.456.789-00',
        name: 'Alice Johnson',
        city: 'São Paulo',
        transactionId: '1',
      });
    });
  });

  it('should handle participant without pix_key', async () => {
    const participant: Person = {
      ...mockParticipant,
      pix_key: undefined,
    };

    render(<PixQRCode participant={participant} />);

    await waitFor(() => {
      expect(mockQrCodePixPayload).toHaveBeenCalledWith(
        expect.objectContaining({
          key: '',
        })
      );
    });
  });

  it('should apply flex and gap classes to container', () => {
    const { container } = render(<PixQRCode participant={mockParticipant} />);

    const mainDiv = container.querySelector('.flex.flex-col');
    expect(mainDiv).toHaveClass('items-end', 'justify-end', 'gap-1');
  });

  it('should have min-h-[15px] class on container', () => {
    const { container } = render(<PixQRCode participant={mockParticipant} />);

    const mainDiv = container.querySelector('.flex.flex-col');
    expect(mainDiv).toHaveClass('min-h-[15px]');
  });

  it('should apply link variant to toggle button', () => {
    render(<PixQRCode participant={mockParticipant} />);

    const button = screen.getAllByTestId('button')[0];
    expect(button).toHaveAttribute('data-variant', 'link');
  });

  it('should apply no-underline class to toggle button', () => {
    render(<PixQRCode participant={mockParticipant} />);

    const button = screen.getAllByTestId('button')[0];
    expect(button).toHaveClass('no-underline');
  });
});

describe('PixQRCode - Open State', () => {
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
    mockUseDisclosure.mockReturnValue({
      isOpen: true,
      onToggle: mockOnToggle,
    });
    mockQrCodePixPayload.mockReturnValue('mock-payload-string');
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    globalThis.alert = vi.fn();
  });

  it('should render QR code when open', () => {
    render(<PixQRCode participant={mockParticipant} />);

    expect(screen.getByTestId('qrcode-canvas')).toBeInTheDocument();
    expect(screen.getByText('fechar QRCode Pix de Alice')).toBeInTheDocument();
    expect(screen.getByText('copiar QRCode Pix')).toBeInTheDocument();
  });
});
