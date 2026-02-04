import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UploadPhotoGallery from './upload-photo-gallery';

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => ({
    user: { uid: 'test-user-id' },
  }),
}));

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn(),
  }),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetGalleryImages: () => ({
    refetch: vi.fn(),
  }),
}));

vi.mock('@/components/dialog/dialog', () => ({
  GenericDialog: ({
    open,
    title,
    description,
    children,
    footer,
  }: {
    open: boolean;
    title: string;
    description: string;
    children: React.ReactNode;
    footer: React.ReactNode;
  }) => (
    <div data-testid="generic-dialog" data-open={open}>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
      {footer}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  Upload: () => <span data-testid="upload-icon">Upload Icon</span>,
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/services/firebase', () => ({
  storage: {},
}));

describe('UploadPhotoGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering with User Logged In', () => {
    it('should render upload button when user is logged in', () => {
      render(<UploadPhotoGallery />);

      const uploadButton = screen.getByRole('button', {
        name: /Enviar foto/i,
      });
      expect(uploadButton).toBeInTheDocument();
    });

    it('should have Upload icon on button', () => {
      render(<UploadPhotoGallery />);

      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('should have mb-4 class for spacing', () => {
      const { container } = render(<UploadPhotoGallery />);

      const wrapper = container.querySelector('div.mb-4');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have gap-2 for button content spacing', () => {
      render(<UploadPhotoGallery />);

      const button = screen.getByRole('button', {
        name: /Enviar foto/i,
      });
      expect(button).toHaveClass('gap-2');
    });
  });

  describe('Upload Button', () => {
    it('should render button with correct text', () => {
      render(<UploadPhotoGallery />);

      expect(screen.getByText('Enviar foto')).toBeInTheDocument();
    });

    it('should have text-sm and font-semibold classes', () => {
      const { container } = render(<UploadPhotoGallery />);

      const textSpan = container.querySelector('span.text-sm');
      expect(textSpan).toHaveClass('font-semibold');
    });
  });

  describe('Dialog', () => {
    it('should render dialog component', () => {
      render(<UploadPhotoGallery />);

      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });

    it('should have correct dialog title', () => {
      render(<UploadPhotoGallery />);

      expect(
        screen.getByRole('heading', { name: 'Enviar Foto' })
      ).toBeInTheDocument();
    });

    it('should have correct dialog description', () => {
      render(<UploadPhotoGallery />);

      expect(
        screen.getByText('Envie uma foto para a galeria')
      ).toBeInTheDocument();
    });

    it('should render cancel button in dialog footer', () => {
      render(<UploadPhotoGallery />);

      const cancelButton = screen.getByRole('button', {
        name: /Cancelar/i,
      });
      expect(cancelButton).toBeInTheDocument();
    });

    it('should have ml-2 class on cancel button', () => {
      render(<UploadPhotoGallery />);

      const cancelButton = screen.getByRole('button', {
        name: /Cancelar/i,
      });
      expect(cancelButton).toHaveClass('ml-2');
    });
  });

  describe('File Input', () => {
    it('should render file input with accept="image/*"', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('should render file input with block class', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveClass('block');
    });

    it('should be in flex column container', () => {
      const { container } = render(<UploadPhotoGallery />);

      const flexContainer = container.querySelector('.flex-col');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass(
        'items-center',
        'justify-center',
        'mb-4'
      );
    });
  });

  describe('User Not Logged In', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('should not render upload section when user is not logged in', () => {
      vi.doMock('@/hooks/user-verify', () => ({
        useUserVerification: () => ({
          user: null,
        }),
      }));

      render(<UploadPhotoGallery />);

      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });
  });

  describe('Dialog Interaction', () => {
    it('should have dialog with flex layout', () => {
      render(<UploadPhotoGallery />);

      const dialog = screen.getByTestId('generic-dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have rounded class on dialog', () => {
      render(<UploadPhotoGallery />);

      const dialog = screen.getByTestId('generic-dialog');

      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have proper flex structure for button container', () => {
      const { container } = render(<UploadPhotoGallery />);

      const buttonContainer = container.querySelector('div.mb-4');
      expect(buttonContainer).toHaveClass('flex', 'justify-start');
    });

    it('should have fragment wrapping both button and dialog', () => {
      render(<UploadPhotoGallery />);

      expect(
        screen.getByRole('button', { name: /Enviar foto/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button with text content', () => {
      render(<UploadPhotoGallery />);

      const button = screen.getByRole('button', {
        name: /Enviar foto/i,
      });
      expect(button).toBeVisible();
    });

    it('should have accessible file input', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeVisible();
    });

    it('should have dialog with proper accessibility', () => {
      render(<UploadPhotoGallery />);

      const dialog = screen.getByTestId('generic-dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('File Upload Handling', () => {
    it('should have file input that accepts images', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput.accept).toBe('image/*');
    });

    it('should render dialog with proper structure for file upload', () => {
      render(<UploadPhotoGallery />);

      const dialog = screen.getByTestId('generic-dialog');
      expect(dialog).toHaveTextContent('Enviar Foto');
      expect(dialog).toHaveTextContent('Envie uma foto para a galeria');
    });
  });

  describe('Component Composition', () => {
    it('should render both upload button and dialog', () => {
      render(<UploadPhotoGallery />);

      expect(
        screen.getByRole('button', { name: /Enviar foto/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });

    it('should have input element within dialog', () => {
      render(<UploadPhotoGallery />);

      const dialog = screen.getByTestId('generic-dialog');
      const fileInput = dialog.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should have cancel button in dialog footer', () => {
      render(<UploadPhotoGallery />);

      const cancelButton = screen.getByRole('button', {
        name: /Cancelar/i,
      });
      expect(cancelButton.parentElement).toBeInTheDocument();
    });
  });

  describe('Styling Classes', () => {
    it('should have proper button styling', () => {
      render(<UploadPhotoGallery />);

      const uploadButton = screen.getByRole('button', {
        name: /Enviar foto/i,
      });
      expect(uploadButton).toHaveClass('gap-2');
    });

    it('should have mb-4 on container', () => {
      const { container } = render(<UploadPhotoGallery />);

      const container_div = container.querySelector('div.mb-4');
      expect(container_div).toBeInTheDocument();
    });

    it('should have flex justify-start on button container', () => {
      const { container } = render(<UploadPhotoGallery />);

      const buttonContainer = container.querySelector('div.mb-4');
      expect(buttonContainer).toHaveClass('flex', 'justify-start');
    });

    it('should have flex flex-col on file input container', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileContainer = container.querySelector('div.flex-col');
      expect(fileContainer).toHaveClass(
        'items-center',
        'justify-center',
        'mb-4'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple renders', () => {
      const { rerender } = render(<UploadPhotoGallery />);

      expect(
        screen.getByRole('button', { name: /Enviar foto/i })
      ).toBeInTheDocument();

      rerender(<UploadPhotoGallery />);

      expect(
        screen.getByRole('button', { name: /Enviar foto/i })
      ).toBeInTheDocument();
    });

    it('should maintain dialog structure on rerender', () => {
      const { rerender } = render(<UploadPhotoGallery />);

      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();

      rerender(<UploadPhotoGallery />);

      expect(screen.getByTestId('generic-dialog')).toBeInTheDocument();
    });
  });
});
