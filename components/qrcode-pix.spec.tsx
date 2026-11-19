import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  }) => ({
    payload: () => mockQrCodePixPayload(config),
  }),
}));

vi.mock('qrcode.react', () => ({
  QRCodeCanvas: ({ value, size }: { value: string; size: number }) => (
    <div data-testid="qrcode-canvas" data-value={value} data-size={size} />
  ),
}));

describe('PixQRCode', () => {
  const mockParticipant: Person = {
    id: 1,
    name: 'Alice',
    fullName: 'Alice Johnson',
    date: '1990-01-15',
    month: '01',
    city: 'São Paulo',
    pix_key: '123.456.789-00',
    pix_key_type: 'cpf',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockQrCodePixPayload.mockReturnValue('mock-payload-string');
  });

  it('should render the QR code inline with the generated payload', () => {
    render(<PixQRCode participant={mockParticipant} />);

    const qr = screen.getByTestId('qrcode-canvas');
    expect(qr).toHaveAttribute('data-value', 'mock-payload-string');
    expect(qr).toHaveAttribute('data-size', '104');
  });

  it('should build the payload from the participant data', () => {
    render(<PixQRCode participant={mockParticipant} />);

    expect(mockQrCodePixPayload).toHaveBeenCalledWith({
      version: '01',
      key: '123.456.789-00',
      name: 'Alice Johnson',
      city: 'São Paulo',
      transactionId: '1',
    });
  });

  it('should use an empty key when pix_key is undefined', () => {
    render(
      <PixQRCode participant={{ ...mockParticipant, pix_key: undefined }} />
    );

    expect(mockQrCodePixPayload).toHaveBeenCalledWith(
      expect.objectContaining({ key: '' })
    );
  });

  it('should show the key type and value below the QR code', () => {
    render(<PixQRCode participant={mockParticipant} />);

    expect(
      screen.getByText('Chave PIX: CPF · 123.456.789-00')
    ).toBeInTheDocument();
  });
});
