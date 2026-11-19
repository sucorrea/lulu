import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PixInfo from './pix-info';
import { Person } from './lulus/types';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

describe('PixInfo', () => {
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
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should copy pix key to clipboard on button click', async () => {
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '123.456.789-00'
    );
  });

  it('should show success toast when copying', async () => {
    render(<PixInfo participant={mockParticipant} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copiar chave PIX' }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Chave PIX copiada com sucesso!'
      );
    });
  });

  it('should show error toast when copying fails', async () => {
    (
      navigator.clipboard.writeText as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('denied'));
    render(<PixInfo participant={mockParticipant} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copiar chave PIX' }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Não foi possível copiar a chave PIX'
      );
    });
  });

  it('should render the copy button without the key', () => {
    render(<PixInfo participant={mockParticipant} />);

    const button = screen.getByRole('button', { name: 'Copiar chave PIX' });
    expect(button).toHaveTextContent('Copiar PIX');
    expect(button).not.toHaveTextContent('123.456.789-00');
  });

  it('should copy empty string when pix_key is undefined', () => {
    render(
      <PixInfo participant={{ ...mockParticipant, pix_key: undefined }} />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
  });
});
