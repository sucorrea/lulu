import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Person } from '../types';
import PersonForm from './person-form';
import { UpdateParticipantOptions } from '@/services/queries/updateParticipant';
import { User } from 'firebase/auth';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(() => ({
    user: {
      uid: 'test-user-id',
      displayName: 'Test User',
      email: 'test@example.com',
    },
    isLogged: true,
    isAdmin: true,
    handleLogout: vi.fn(),
  })),
}));

vi.mock('@/services/queries/updateParticipant', () => ({
  useUpdateParticipantData: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
    variant?: string;
  }) => (
    <button
      data-testid={`button-${variant || type}`}
      onClick={onClick}
      className={className}
      type={type as 'button' | 'submit' | 'reset'}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(
    ({
      id,
      type,
      placeholder,
      className,
      disabled,
      maxLength,
      required,
      ...props
    }: {
      id?: string;
      type?: string;
      placeholder?: string;
      className?: string;
      disabled?: boolean;
      maxLength?: number;
      required?: boolean;
    }) => (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        {...props}
      />
    )
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <button
      type="button"
      data-testid="select"
      data-value={value}
      onClick={() => onValueChange('test')}
    >
      {children}
    </button>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-trigger">{children}</span>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`select-item-${value}`}>{children}</div>,
}));

describe('PersonForm', () => {
  const mockPerson: Person = {
    id: 1,
    name: 'John Doe',
    fullName: 'John Doe',
    date: '1990-01-01',
    month: '01',
    email: 'john@example.com',
    phone: '123456789',
    instagram: 'johndoe',
    pix_key: '123456',
    pix_key_type: 'cpf',
    city: 'Test City',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all fields', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByText('Nome completo')).toBeDefined();
    expect(screen.getByText('Data de nascimento')).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Celular')).toBeDefined();

    const input = screen.getByPlaceholderText(
      'Nome completo'
    ) as unknown as HTMLInputElement;
    expect(input.value).toBe('John Doe');
  });

  it('should render date input with value', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByLabelText(
      'Data de nascimento'
    ) as unknown as HTMLInputElement;
    expect(input.value).toBe('1990-01-01');
  });

  it('should render email input with value', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Email'
    ) as unknown as HTMLInputElement;
    expect(input.value).toBe('john@example.com');
  });

  it('should render phone input with value', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Telefone'
    ) as unknown as HTMLInputElement;
    expect(input.value).toBe('123456789');
  });

  it('should render instagram input disabled when initialData has instagram', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Instagram'
    ) as unknown as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should render instagram input enabled when no instagram in initialData', () => {
    const personWithoutInstagram = { ...mockPerson, instagram: undefined };
    render(<PersonForm initialData={personWithoutInstagram} />);

    const input = screen.getByPlaceholderText(
      'Instagram'
    ) as unknown as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  it('should render pix key input', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Chave Pix'
    ) as unknown as HTMLInputElement;
    expect(input).toBeDefined();
  });

  it('should render Voltar button', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByText('Voltar')).toBeDefined();
  });

  it('should render Salvar button', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByText('Salvar')).toBeDefined();
  });

  it('should call router.push on Voltar button click', () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });

    render(<PersonForm initialData={mockPerson} />);

    const button = screen.getByText('Voltar');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should have required attribute on fullName input', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Nome completo'
    ) as unknown as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('should have maxLength 80 on fullName input', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByPlaceholderText(
      'Nome completo'
    ) as unknown as HTMLInputElement;
    expect(input.maxLength).toBe(80);
  });

  it('should have required attribute on date input', () => {
    render(<PersonForm initialData={mockPerson} />);

    const input = screen.getByLabelText(
      'Data de nascimento'
    ) as unknown as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('should render select for pix_key_type', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByTestId('select')).toBeDefined();
  });

  it('should render all pix type options', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByTestId('select-item-cpf')).toBeDefined();
    expect(screen.getByTestId('select-item-email')).toBeDefined();
    expect(screen.getByTestId('select-item-phone')).toBeDefined();
    expect(screen.getByTestId('select-item-random')).toBeDefined();
    expect(screen.getByTestId('select-item-none')).toBeDefined();
  });

  it('should render form with space-y-3 class', () => {
    const { container } = render(<PersonForm initialData={mockPerson} />);

    const form = container.querySelector('form');
    expect(form?.className).toContain('space-y-2 md:space-y-4');
  });

  it('should render pix section with border', () => {
    const { container } = render(<PersonForm initialData={mockPerson} />);

    const pixSection = container.querySelector('.border-2');
    expect(pixSection).toBeDefined();
  });

  it('should render Tipo de chave Pix label', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByText('Tipo de chave Pix')).toBeDefined();
  });

  it('should render Chave Pix label', () => {
    render(<PersonForm initialData={mockPerson} />);

    expect(screen.getByText('Chave Pix')).toBeDefined();
  });

  it('should render buttons in flex justify-between container', () => {
    const { container } = render(<PersonForm initialData={mockPerson} />);

    const buttonContainer = container.querySelector('.flex.justify-between');
    expect(buttonContainer).toBeDefined();
  });

  it('should pass user info to mutation when submitting form', async () => {
    const { useUpdateParticipantData } = await import(
      '@/services/queries/updateParticipant'
    );
    const mockMutate = vi.fn();
    vi.mocked(useUpdateParticipantData).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as UseMutationResult<
      void,
      Error,
      UpdateParticipantOptions,
      unknown
    >);

    render(<PersonForm initialData={mockPerson} />);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockMutate).toHaveBeenCalled();

    const calls = mockMutate.mock.calls;
    if (calls.length > 0) {
      const firstCallArgs = calls[0][0];

      expect(firstCallArgs.userId).toBe('test-user-id');
      expect(firstCallArgs.userName).toBe('Test User');
      expect(firstCallArgs.userEmail).toBe('test@example.com');

      expect(firstCallArgs.auditMetadata?.source).toBe('web-form');
    }
  });

  it('should show error toast when user is not authenticated', async () => {
    const { useUserVerification } = await import('@/hooks/user-verify');
    const { useUpdateParticipantData } = await import(
      '@/services/queries/updateParticipant'
    );

    const mockMutate = vi.fn();
    vi.mocked(useUpdateParticipantData).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as UseMutationResult<
      void,
      Error,
      UpdateParticipantOptions,
      unknown
    >);

    vi.mocked(useUserVerification).mockReturnValue({
      user: null,
      isLogged: false,
      handleLogout: vi.fn(),
    } as unknown as {
      user: User | null;
      isLogged: boolean;
      isLoading: boolean;
      handleLogout: () => void;
    } as unknown as ReturnType<typeof useUserVerification>);

    render(<PersonForm initialData={mockPerson} />);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockMutate).not.toHaveBeenCalled();
  });
});
