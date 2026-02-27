import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GiftProfileForm } from './gift-profile-form';
import type { Person } from '../types';

const mockMutate = vi.fn();

vi.mock('@/services/queries/updateParticipant', () => ({
  useUpdateParticipantData: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(() => ({
    user: {
      uid: '123',
      displayName: 'Test User',
      email: 'test@test.com',
    },
    isLogged: true,
    isAdmin: false,
    isLulu: true,
    role: 'lulu',
    participantId: 'p1',
    isLoading: false,
    handleLogout: vi.fn(),
  })),
}));

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

const mockPerson: Person = {
  id: 1,
  fullName: 'Test Person',
  name: 'Test',
  date: '2000-01-01',
  month: 'Janeiro',
  city: 'SP',
};

describe('GiftProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all main form fields', () => {
    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    expect(screen.getByText('Lista de Desejos')).toBeInTheDocument();
    expect(screen.getByLabelText('Tamanho de calçado')).toBeInTheDocument();
    expect(screen.getByLabelText('Cor favorita')).toBeInTheDocument();
    expect(screen.getByLabelText('Loja preferida')).toBeInTheDocument();
    expect(screen.getByLabelText('Hobbies e interesses')).toBeInTheDocument();
    expect(
      screen.getByText('Alergias (alimentares, cosméticos, etc.)')
    ).toBeInTheDocument();
    expect(screen.getByText('Endereço para entrega')).toBeInTheDocument();
    expect(
      screen.getByText('Salvar Informações de Presente')
    ).toBeInTheDocument();
  });

  it('should add and remove wish list items', async () => {
    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    fireEvent.click(screen.getByText('Adicionar'));

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Nome do item')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Link do produto (opcional)')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Remover item 1'));

    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  it('should submit form data', async () => {
    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    fireEvent.change(screen.getByLabelText('Cor favorita'), {
      target: { value: 'azul' },
    });

    fireEvent.click(screen.getByText('Salvar Informações de Presente'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('should render with initial wish list data', () => {
    const personWithWishList: Person = {
      ...mockPerson,
      wishList: [
        { item: 'Livro', url: 'https://example.com', comprado: false },
      ],
    };

    render(
      <GiftProfileForm participantId="p1" initialData={personWithWishList} />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Livro')).toBeInTheDocument();
  });

  it('should show disabled submit button when form is clean', () => {
    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    const submitBtn = screen.getByText('Salvar Informações de Presente');
    expect(submitBtn).toBeDisabled();
  });

  it('should render address fields', () => {
    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    expect(screen.getByLabelText('CEP')).toBeInTheDocument();
    expect(screen.getByLabelText('Rua')).toBeInTheDocument();
    expect(screen.getByLabelText('Número')).toBeInTheDocument();
    expect(screen.getByLabelText('Complemento')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
  });

  it('should show error toast when user is null and submits', async () => {
    const { useUserVerification } = await import('@/hooks/user-verify');
    vi.mocked(useUserVerification).mockReturnValue({
      user: null,
      isLogged: false,
      isAdmin: false,
      isLulu: false,
      role: 'visitante',
      participantId: undefined,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    render(<GiftProfileForm participantId="p1" initialData={mockPerson} />);

    fireEvent.change(screen.getByLabelText('Cor favorita'), {
      target: { value: 'rosa' },
    });

    fireEvent.click(screen.getByText('Salvar Informações de Presente'));

    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
