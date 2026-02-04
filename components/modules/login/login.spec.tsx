import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import LoginPage from './login';

vi.mock('next/navigation');
vi.mock('firebase/auth');
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));
vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
}));

global.alert = vi.fn();

const mockPush = vi.fn();
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as Mock;
const mockCreateUserWithEmailAndPassword =
  createUserWithEmailAndPassword as Mock;
const mockSignInWithPopup = signInWithPopup as Mock;
const mockSendPasswordResetEmail = sendPasswordResetEmail as Mock;

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    mockSignInWithEmailAndPassword.mockResolvedValue({});
    mockCreateUserWithEmailAndPassword.mockResolvedValue({});
    mockSignInWithPopup.mockResolvedValue({});
    mockSendPasswordResetEmail.mockResolvedValue(undefined);
  });

  describe('initial rendering', () => {
    it('should display subtitle for login mode', () => {
      render(<LoginPage />);

      expect(
        screen.getByText('Faça login para administrar as Lulus.')
      ).toBeInTheDocument();
    });

    it('should have all icons rendered', () => {
      render(<LoginPage />);

      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });

    it('should render forgot password button in login mode', () => {
      render(<LoginPage />);

      expect(
        screen.getByRole('button', { name: 'Esqueceu a senha ?' })
      ).toBeInTheDocument();
    });

    it('should render Google sign-in button', () => {
      render(<LoginPage />);

      expect(
        screen.getByRole('button', { name: /Google/i })
      ).toBeInTheDocument();
    });
  });

  describe('password visibility toggle', () => {
    it('should toggle password visibility on eye button click', async () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText(
        'Senha'
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');

      const eyeButton = screen.getByTestId('eye-icon').closest('button');
      fireEvent.click(eyeButton!);

      await waitFor(() => {
        expect(passwordInput.type).toBe('text');
      });

      fireEvent.click(eyeButton!);

      await waitFor(() => {
        expect(passwordInput.type).toBe('password');
      });
    });

    it('should show EyeOff icon when password is visible', async () => {
      render(<LoginPage />);

      const eyeButton = screen.getByTestId('eye-icon').closest('button');
      fireEvent.click(eyeButton!);

      await waitFor(() => {
        expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
      });
    });
  });

  describe('mode toggling (login/signup)', () => {
    it('should toggle between login and signup modes', async () => {
      render(<LoginPage />);

      expect(
        screen.getByRole('heading', { name: 'Entrar' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Faça login para administrar as Lulus.')
      ).toBeInTheDocument();

      const toggleButtons = screen.getAllByRole('button', {
        name: 'Criar Conta',
      });
      fireEvent.click(toggleButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Criar conta' })
        ).toBeInTheDocument();
        expect(
          screen.getByText('Crie sua conta para entrar no clube das Lulus.')
        ).toBeInTheDocument();
      });
    });

    it('should hide forgot password button in signup mode', async () => {
      render(<LoginPage />);

      expect(
        screen.getByRole('button', { name: 'Esqueceu a senha ?' })
      ).toBeInTheDocument();

      const allToggleButtons = screen.getAllByRole('button', {
        name: 'Criar Conta',
      });
      fireEvent.click(allToggleButtons[0]);

      await waitFor(() => {
        expect(
          screen.queryByRole('button', { name: 'Esqueceu a senha ?' })
        ).not.toBeInTheDocument();
      });
    });

    it('should update form button text based on mode', async () => {
      render(<LoginPage />);

      let submitButtons = screen.getAllByRole('button', { name: 'Entrar' });
      expect(submitButtons.length).toBeGreaterThan(0);

      const toggleButtons = screen.getAllByRole('button', {
        name: 'Criar Conta',
      });
      fireEvent.click(toggleButtons[0]);

      await waitFor(() => {
        const createButtons = screen.getAllByRole('button', {
          name: 'Criar Conta',
        });
        expect(
          createButtons.some((btn) => btn.getAttribute('type') === 'submit')
        ).toBe(true);
      });
    });
  });

  describe('email input handling', () => {
    it('should update email state when input changes', () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(
        'Email'
      ) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should have email input with type email', () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(
        'Email'
      ) as HTMLInputElement;
      expect(emailInput.type).toBe('email');
    });
  });

  describe('password input handling', () => {
    it('should update password state when input changes', () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText(
        'Senha'
      ) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('login authentication', () => {
    it('should handle successful email login', async () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        );
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should display error message on login failure', async () => {
      const errorMessage = 'Invalid email or password';
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        message: `Firebase: ${errorMessage}`,
      });

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display error with fallback message if error has no message', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({});

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Authentication failed')).toBeInTheDocument();
      });
    });

    it('should prevent submit button click when loading', async () => {
      mockSignInWithEmailAndPassword.mockImplementation(
        () => new Promise(() => {})
      );

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should clear previous error on new submit attempt', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        message: 'Firebase: Error 1',
      });

      const { rerender } = render(<LoginPage />);

      let emailInput = screen.getByPlaceholderText('Email');
      let passwordInput = screen.getByPlaceholderText('Senha');
      let submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Error 1')).toBeInTheDocument();
      });

      mockSignInWithEmailAndPassword.mockResolvedValueOnce({});

      emailInput = screen.getByPlaceholderText('Email');
      passwordInput = screen.getByPlaceholderText('Senha');
      submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'correct' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('signup authentication', () => {
    it('should handle successful signup', async () => {
      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: 'Criar Conta' });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Criar conta')).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });

      fireEvent.change(emailInput, {
        target: { value: 'newuser@example.com' },
      });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'newuser@example.com',
          'password123'
        );
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should display error message on signup failure', async () => {
      const errorMessage = 'Email already in use';
      mockCreateUserWithEmailAndPassword.mockRejectedValueOnce({
        message: `Firebase: ${errorMessage}`,
      });

      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: 'Criar Conta' });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Criar conta')).toBeInTheDocument();
      });

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });

      fireEvent.change(emailInput, {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Google sign-in', () => {
    it('should handle successful Google sign-in', async () => {
      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /Google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      await waitFor(() => {
        expect(mockSignInWithPopup).toHaveBeenCalledWith(
          expect.anything(),
          expect.any(Object)
        );
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should display error message on Google sign-in failure', async () => {
      const errorMessage = 'Google sign-in cancelled';
      mockSignInWithPopup.mockRejectedValueOnce({
        message: `Firebase: ${errorMessage}`,
      });

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /Google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display fallback error message on Google sign-in failure without message', async () => {
      mockSignInWithPopup.mockRejectedValueOnce({});

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /Google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Google sign-in failed')).toBeInTheDocument();
      });
    });

    it('should disable Google button when loading', async () => {
      mockSignInWithPopup.mockImplementation(() => new Promise(() => {}));

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /Google/i });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(googleButton).toBeDisabled();
      });
    });

    it('should create GoogleAuthProvider instance', async () => {
      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /Google/i });

      await act(async () => {
        fireEvent.click(googleButton);
      });

      await waitFor(() => {
        expect(GoogleAuthProvider).toHaveBeenCalled();
      });
    });
  });

  describe('forgot password', () => {
    it('should handle successful password reset', async () => {
      render(<LoginPage />);

      const forgotButton = screen.getByRole('button', {
        name: 'Esqueceu a senha ?',
      });
      const emailInput = screen.getByPlaceholderText(
        'Email'
      ) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await act(async () => {
        fireEvent.click(forgotButton);
      });

      await waitFor(() => {
        expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com'
        );
        expect(global.alert).toHaveBeenCalledWith(
          'Senha de redefinição enviada para o seu email.'
        );
      });
    });

    it('should display error when email is empty in forgot password', async () => {
      render(<LoginPage />);

      const forgotButton = screen.getByRole('button', {
        name: 'Esqueceu a senha ?',
      });

      await act(async () => {
        fireEvent.click(forgotButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Por favor, insira seu email.')
        ).toBeInTheDocument();
      });
    });

    it('should display error message on password reset failure', async () => {
      const errorMessage = 'User not found';
      mockSendPasswordResetEmail.mockRejectedValueOnce({
        message: `Firebase: ${errorMessage}`,
      });

      render(<LoginPage />);

      const forgotButton = screen.getByRole('button', {
        name: 'Esqueceu a senha ?',
      });
      const emailInput = screen.getByPlaceholderText('Email');

      fireEvent.change(emailInput, {
        target: { value: 'notfound@example.com' },
      });

      await act(async () => {
        fireEvent.click(forgotButton);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display fallback error on password reset failure without message', async () => {
      mockSendPasswordResetEmail.mockRejectedValueOnce({});

      render(<LoginPage />);

      const forgotButton = screen.getByRole('button', {
        name: 'Esqueceu a senha ?',
      });
      const emailInput = screen.getByPlaceholderText('Email');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await act(async () => {
        fireEvent.click(forgotButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('Falha ao enviar a senha de redefinição')
        ).toBeInTheDocument();
      });
    });

    it('should set loading state while sending password reset', async () => {
      mockSendPasswordResetEmail.mockImplementation(
        () => new Promise(() => {})
      );

      render(<LoginPage />);

      const forgotButton = screen.getByRole('button', {
        name: 'Esqueceu a senha ?',
      });
      const emailInput = screen.getByPlaceholderText('Email');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(forgotButton);

      await waitFor(() => {
        const allButtons = screen.getAllByRole('button');
        const submitButton = allButtons.find(
          (btn) => btn.getAttribute('type') === 'submit'
        );
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('form submission', () => {
    it('should prevent default form submission', async () => {
      const { container } = render(<LoginPage />);

      const form = container.querySelector('form') as HTMLFormElement;
      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault');

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.submit(form);

      expect(preventDefaultSpy).toHaveBeenCalled();

      preventDefaultSpy.mockRestore();
    });

    it('should require email field', () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(
        'Email'
      ) as HTMLInputElement;
      expect(emailInput.required).toBe(true);
    });

    it('should require password field', () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText(
        'Senha'
      ) as HTMLInputElement;
      expect(passwordInput.required).toBe(true);
    });
  });

  describe('UI styling and structure', () => {
    it('should have correct container structure', () => {
      const { container } = render(<LoginPage />);

      const mainContainer = container.querySelector(
        '.flex.min-h-screen.items-center.justify-center'
      );
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have card styling', () => {
      const { container } = render(<LoginPage />);

      const card = container.querySelector('.lulu-card');
      expect(card).toBeInTheDocument();
    });

    it('should have Lulu header styling', () => {
      const { container } = render(<LoginPage />);

      const header = container.querySelector('.lulu-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Luluzinha');
    });

    it('should display error message with correct styling', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        message: 'Firebase: Test error',
      });

      const { container } = render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        const errorDiv = container.querySelector(
          '.bg-destructive\\/10.text-destructive'
        );
        expect(errorDiv).toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('should display loading spinner text during authentication', async () => {
      mockSignInWithEmailAndPassword.mockImplementation(
        () => new Promise(() => {})
      );

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Processando...')).toBeInTheDocument();
      });
    });

    it('should disable all action buttons while loading', async () => {
      mockSignInWithEmailAndPassword.mockImplementation(
        () => new Promise(() => {})
      );

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      const googleButton = screen.getByRole('button', { name: /Google/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(googleButton).toBeDisabled();
      });
    });
  });

  describe('text content and labels', () => {
    it('should display correct divider text', () => {
      render(<LoginPage />);

      expect(screen.getByText('Ou faça login com')).toBeInTheDocument();
    });

    it('should display correct toggle text in login mode', () => {
      render(<LoginPage />);

      expect(screen.getByText('Não tem uma conta?')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Criar Conta' })
      ).toBeInTheDocument();
    });

    it('should display correct toggle text in signup mode', async () => {
      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: 'Criar Conta' });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Entrar' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('error handling edge cases', () => {
    it('should handle Firebase error message removal', async () => {
      const errorMessage = 'Invalid email or password';
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        message: `Firebase: ${errorMessage}`,
      });

      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Senha');
      const submitButtons = screen.getAllByRole('button', { name: 'Entrar' });
      const submitButton = submitButtons.find(
        (btn) => btn.getAttribute('type') === 'submit'
      );

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      await act(async () => {
        fireEvent.click(submitButton!);
      });

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
});
