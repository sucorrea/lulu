import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import EditPhoto from './edit-photo';
import { Person } from './types';

const mockOnOpen = vi.fn();
const mockOnClose = vi.fn();
const mockMutate = vi.fn();

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: mockOnOpen,
    onClose: mockOnClose,
    onToggle: mockOnOpen,
  }),
}));

vi.mock('@/hooks/useUploadPhoto', () => ({
  useUploadPhoto: () => ({
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

vi.mock('lucide-react', () => ({
  CameraIcon: ({ size }: { size: string }) => (
    <span data-testid="camera-icon" data-size={size}>
      Camera
    </span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    className,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../dialog/dialog', () => ({
  GenericDialog: ({
    open,
    onOpenChange,
    title,
    footer,
    children,
    className,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    footer: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="generic-dialog" data-open={open} className={className}>
      <h2>{title}</h2>
      <button data-testid="dialog-toggle" onClick={() => onOpenChange(!open)} />
      {children}
      <div data-testid="dialog-footer">{footer}</div>
    </div>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

vi.mock('../ui/avatar', () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="avatar-image" data-src={src} data-alt={alt} />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

vi.mock('../upload-file-form', () => ({
  default: ({
    participantId,
    setFile,
  }: {
    participantId: string;
    setFile: (file: File | null) => void;
  }) => (
    <div data-testid="upload-form" data-participant-id={participantId}>
      <input
        type="file"
        data-testid="file-input"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFile(file);
        }}
      />
    </div>
  ),
}));

describe('EditPhoto', () => {
  const mockParticipant: Person = {
    id: 1,
    name: 'Test User',
    fullName: 'Test User Full',
    date: '1990-01-01',
    month: '01',
    city: 'Test City',
    photoURL: 'https://example.com/photo.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  });

  describe('Initial Rendering', () => {
    it('should render open button with camera icon', () => {
      render(<EditPhoto participant={mockParticipant} />);

      expect(screen.getByText('Alterar foto')).toBeInTheDocument();
      expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    });

    it('should render camera icon with correct size', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const icon = screen.getByTestId('camera-icon');
      expect(icon).toHaveAttribute('data-size', '1rem');
    });

    it('should render button with correct classes', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const button = screen.getByRole('button', { name: /Alterar foto/i });
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'gap-1',
        'text-primary',
        'hover:no-underline'
      );
    });

    it('should render button with link variant', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const button = screen.getByRole('button', { name: /Alterar foto/i });
      expect(button).toHaveAttribute('data-variant', 'link');
    });

    it('should render dialog component', () => {
      render(<EditPhoto participant={mockParticipant} />);

      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });
  });

  describe('Dialog Interaction', () => {
    it('should call onOpen when button is clicked', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const button = screen.getByText('Alterar foto');
      fireEvent.click(button);

      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });

    it('should render dialog with participant name as title', () => {
      render(<EditPhoto participant={mockParticipant} />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('should render dialog with correct className', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const dialog = screen.getByTestId('generic-dialog');
      expect(dialog).toHaveClass(
        'w-[calc(100%-2rem)]',
        'max-w-[min(400px,95vw)]',
        'sm:max-w-[50%]',
        'rounded'
      );
    });

    it('should have dialog closed by default', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const dialog = screen.getByTestId('generic-dialog');
      expect(dialog).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Avatar Display', () => {
    it('should render avatar with correct classes', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('h-32', 'w-32', 'border-4', 'border-primary');
    });

    it('should render avatar image with participant photo URL', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toHaveAttribute(
        'data-src',
        'https://example.com/photo.jpg'
      );
      expect(avatarImage).toHaveAttribute('data-alt', 'Test User');
    });

    it('should render avatar fallback with first letter', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('T');
    });

    it('should render fallback with question mark when name is empty', () => {
      const participantNoName: Person = {
        ...mockParticipant,
        name: '',
      };

      render(<EditPhoto participant={participantNoName} />);

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('?');
    });

    it('should render avatar with empty photoURL when not provided', () => {
      const participantNoPhoto: Person = {
        ...mockParticipant,
        photoURL: undefined,
      };

      render(<EditPhoto participant={participantNoPhoto} />);

      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toHaveAttribute('data-src', '');
    });
  });

  describe('File Selection', () => {
    it('should update avatar image when file is selected', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const avatarImage = screen.getByTestId('avatar-image');
        expect(avatarImage).toHaveAttribute('data-src', 'blob:mock-url');
        expect(avatarImage).toHaveAttribute('data-alt', 'Nova foto');
      });
    });

    it('should call URL.createObjectURL when file is selected', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should render upload form with correct participant id', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const uploadForm = screen.getByTestId('upload-form');
      expect(uploadForm).toHaveAttribute('data-participant-id', '1');
    });
  });

  describe('Footer Buttons', () => {
    it('should render cancel button', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const cancelButton = screen.getByText('Cancelar');
      expect(cancelButton).toBeInTheDocument();
    });

    it('should render confirm button', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const confirmButton = screen.getByText('Confirmar');
      expect(confirmButton).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have cancel button with outline variant', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const cancelButton = screen.getByText('Cancelar');
      expect(cancelButton).toHaveAttribute('data-variant', 'outline');
    });

    it('should have confirm button with default variant', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const confirmButton = screen.getByText('Confirmar');
      expect(confirmButton).toHaveAttribute('data-variant', 'default');
    });

    it('should disable confirm button when no file is selected', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const confirmButton = screen.getByText('Confirmar');
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('Upload Functionality', () => {
    it('should enable confirm button when file is selected', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        expect(confirmButton).not.toBeDisabled();
      });
    });

    it('should call mutate when confirm button is clicked with file', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      expect(mockMutate).toHaveBeenCalledWith(
        { file, participantId: '1' },
        expect.any(Object)
      );
    });

    it('should not call mutate when confirm is clicked without file', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should show success toast on successful upload', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      expect(toast.success).toHaveBeenCalledWith('Foto alterada com sucesso', {
        position: 'bottom-center',
      });
    });

    it('should call onClose on successful upload', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset file to null on successful upload', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      await waitFor(() => {
        const avatarImage = screen.getByTestId('avatar-image');
        expect(avatarImage).toHaveAttribute(
          'data-src',
          'https://example.com/photo.jpg'
        );
      });
    });

    it('should show error toast on upload failure with message', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      onErrorCallback({ message: 'Upload failed' });

      expect(toast.error).toHaveBeenCalledWith('Upload failed');
    });

    it('should show default error message when error has no message', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);
      });

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      onErrorCallback({});

      expect(toast.error).toHaveBeenCalledWith('Erro ao alterar foto');
    });
  });

  describe('Dialog State Management', () => {
    it('should call onOpen when onOpenChange is called with true', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const toggleButton = screen.getByTestId('dialog-toggle');
      fireEvent.click(toggleButton);

      expect(mockOnOpen).toHaveBeenCalled();
    });

    it('should handle onOpenChange with false', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const toggleButton = screen.getByTestId('dialog-toggle');
      fireEvent.click(toggleButton);

      expect(mockOnOpen).toHaveBeenCalled();
    });
  });

  describe('Container Layout', () => {
    it('should render content container with correct classes', () => {
      const { container } = render(<EditPhoto participant={mockParticipant} />);

      const contentDiv = container.querySelector(
        '.flex-col.flex.justify-center.items-center'
      );
      expect(contentDiv).toBeInTheDocument();
    });

    it('should render footer with correct classes', () => {
      const { container } = render(<EditPhoto participant={mockParticipant} />);

      const footer = container.querySelector('.flex.justify-between.gap-2');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle participant with undefined name', () => {
      const participantUndefinedName: Person = {
        ...mockParticipant,
        name: undefined as unknown as string,
      };

      render(<EditPhoto participant={participantUndefinedName} />);

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('?');
    });

    it('should convert participant id to string', () => {
      render(<EditPhoto participant={mockParticipant} />);

      const uploadForm = screen.getByTestId('upload-form');
      expect(uploadForm).toHaveAttribute('data-participant-id', '1');
    });

    it('should handle file removal', async () => {
      render(<EditPhoto participant={mockParticipant} />);

      const fileInput = screen.getByTestId('file-input');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const avatarImage = screen.getByTestId('avatar-image');
        expect(avatarImage).toHaveAttribute('data-src', 'blob:mock-url');
      });

      fireEvent.change(fileInput, { target: { files: [] } });

      await waitFor(() => {
        const avatarImage = screen.getByTestId('avatar-image');
        expect(avatarImage).toHaveAttribute(
          'data-src',
          'https://example.com/photo.jpg'
        );
      });
    });
  });

  describe('Disabled State with isPending', () => {
    it('should disable confirm button when isPending is true', () => {
      vi.mocked(
        vi.fn(() => ({
          mutate: mockMutate,
          isPending: true,
        }))
      );

      render(<EditPhoto participant={mockParticipant} />);

      const confirmButton = screen.getByText('Confirmar');
      expect(confirmButton).toBeDisabled();
    });
  });
});
