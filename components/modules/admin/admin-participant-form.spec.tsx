import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminParticipantForm } from './admin-participant-form';

const mockMutate = vi.fn();

vi.mock('@/services/queries/adminParticipants', () => ({
  useCreateParticipant: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/components/ui/select', () => {
  const MockSelectContent = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return {
    Select: ({
      value,
      onValueChange,
      disabled,
      children,
    }: {
      value?: string;
      onValueChange?: (value: string) => void;
      disabled?: boolean;
      children: React.ReactNode;
    }) => {
      const childArray = React.Children.toArray(children);
      const contentChild = childArray.find(
        (c) => React.isValidElement(c) && c.type === MockSelectContent
      );
      const options =
        contentChild && React.isValidElement(contentChild)
          ? React.Children.toArray(
              (contentChild.props as { children: React.ReactNode }).children
            )
          : [];
      return (
        <div>
          <select
            data-testid="select"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            disabled={disabled}
          >
            {options}
          </select>
        </div>
      );
    },
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectValue: ({ placeholder }: { placeholder?: string }) => (
      <span>{placeholder ?? ''}</span>
    ),
    SelectContent: MockSelectContent,
    SelectItem: ({
      value,
      children,
    }: {
      value: string;
      children: React.ReactNode;
    }) => <option value={value}>{children}</option>,
  };
});

describe('AdminParticipantForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<AdminParticipantForm />);

    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Apelido')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de nascimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
    expect(
      screen.getByLabelText('E-mail de login (Google)')
    ).toBeInTheDocument();
    expect(screen.getByText('Cadastrar Lulu')).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    render(<AdminParticipantForm />);

    fireEvent.click(screen.getByText('Cadastrar Lulu'));

    await waitFor(() => {
      expect(screen.getByText(/nome completo/i)).toBeInTheDocument();
    });
  });

  it('should call mutate with form data on valid submit', async () => {
    render(<AdminParticipantForm />);

    fireEvent.change(screen.getByLabelText('Nome completo'), {
      target: { value: 'Maria Silva' },
    });
    fireEvent.change(screen.getByLabelText('Apelido'), {
      target: { value: 'Mari' },
    });
    fireEvent.change(screen.getByLabelText('Data de nascimento'), {
      target: { value: '2000-03-15' },
    });
    fireEvent.change(screen.getByLabelText('Cidade'), {
      target: { value: 'São Paulo' },
    });
    fireEvent.change(screen.getByLabelText('E-mail de login (Google)'), {
      target: { value: 'maria@gmail.com' },
    });

    const selects = screen.getAllByTestId('select');
    fireEvent.change(selects[0], { target: { value: 'Janeiro' } });

    fireEvent.click(screen.getByText('Cadastrar Lulu'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    const callArgs = mockMutate.mock.calls[0][0];
    expect(callArgs.fullName).toBe('Maria Silva');
    expect(callArgs.name).toBe('Mari');
    expect(callArgs.city).toBe('São Paulo');
    expect(callArgs.authEmail).toBe('maria@gmail.com');
  });

  it('should show email validation error for invalid email', async () => {
    render(<AdminParticipantForm />);

    fireEvent.change(screen.getByLabelText('Nome completo'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Apelido'), {
      target: { value: 'T' },
    });
    fireEvent.change(screen.getByLabelText('Data de nascimento'), {
      target: { value: '2000-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Cidade'), {
      target: { value: 'SP' },
    });
    fireEvent.change(screen.getByLabelText('E-mail de login (Google)'), {
      target: { value: 'invalid' },
    });

    const selects = screen.getAllByTestId('select');
    fireEvent.change(selects[0], { target: { value: 'Janeiro' } });

    fireEvent.click(screen.getByText('Cadastrar Lulu'));

    await waitFor(() => {
      expect(screen.getByText(/e-mail/i)).toBeInTheDocument();
    });
  });
});
