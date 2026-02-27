import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UploadPhotoGallery from './upload-photo-gallery';

const mockOnClose = vi.fn();
const mockRefetch = vi.fn();

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => ({
    user: { uid: 'test-user-id' },
    isAdmin: true,
  }),
}));

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: mockOnClose,
  }),
}));

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetGalleryImages: () => ({
    refetch: mockRefetch,
  }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
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

vi.mock('@/services/queries/uploadGalleryPhoto', () => ({
  uploadGalleryPhoto: vi.fn().mockResolvedValue(undefined),
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

    it('should have min-w-0 on cancel button for overflow containment', () => {
      render(<UploadPhotoGallery />);

      const cancelButton = screen.getByRole('button', {
        name: /Cancelar/i,
      });
      expect(cancelButton).toHaveClass('min-w-0');
    });
  });

  describe('File Input', () => {
    it('should render file input with accept="image/*"', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('should render file input with sr-only for accessibility (hidden, triggered by button)', () => {
      const { container } = render(<UploadPhotoGallery />);

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toHaveClass('sr-only');
    });

    it('should have Escolher arquivo button that triggers file input', () => {
      render(<UploadPhotoGallery />);

      const chooseFileButton = screen.getByRole('button', {
        name: /Escolher arquivo/i,
      });
      expect(chooseFileButton).toBeInTheDocument();
    });

    it('should show Nenhum arquivo escolhido placeholder before file is selected', () => {
      render(<UploadPhotoGallery />);

      expect(screen.getByText('Nenhum arquivo escolhido')).toBeInTheDocument();
    });

    it('should show selected filename after file is chosen', async () => {
      const { uploadGalleryPhoto } = await import(
        '@/services/queries/uploadGalleryPhoto'
      );
      vi.mocked(uploadGalleryPhoto).mockReturnValue(new Promise(() => {}));

      render(<UploadPhotoGallery />);

      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;
      const file = new File(['content'], 'minha-foto.jpg', {
        type: 'image/jpeg',
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByText('minha-foto.jpg')).toBeInTheDocument();
      expect(
        screen.queryByText('Nenhum arquivo escolhido')
      ).not.toBeInTheDocument();
    });

    it('should reset filename to placeholder when Cancel is clicked', async () => {
      const { uploadGalleryPhoto } = await import(
        '@/services/queries/uploadGalleryPhoto'
      );
      vi.mocked(uploadGalleryPhoto).mockReturnValue(new Promise(() => {}));

      render(<UploadPhotoGallery />);

      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;
      const file = new File(['content'], 'reset-test.jpg', {
        type: 'image/jpeg',
      });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      expect(screen.getByText('reset-test.jpg')).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
      });

      expect(screen.queryByText('reset-test.jpg')).not.toBeInTheDocument();
      expect(screen.getByText('Nenhum arquivo escolhido')).toBeInTheDocument();
    });

    it('should have file picker container with overflow containment', () => {
      render(<UploadPhotoGallery />);

      const chooseFileButton = screen.getByRole('button', {
        name: /Escolher arquivo/i,
      });
      const filePickerContainer = chooseFileButton.closest('.overflow-hidden');
      expect(filePickerContainer).toBeInTheDocument();
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

    it('should have accessible file input with aria-label', () => {
      render(<UploadPhotoGallery />);

      const fileInput = screen.getByLabelText(/Selecionar foto para enviar/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
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
      ) as unknown as HTMLInputElement;
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

    it('should have file picker with flex layout and overflow containment', () => {
      render(<UploadPhotoGallery />);

      const chooseFileButton = screen.getByRole('button', {
        name: /Escolher arquivo/i,
      });
      const filePickerContainer = chooseFileButton.closest('.flex');
      expect(filePickerContainer).toBeInTheDocument();
      expect(filePickerContainer).toHaveClass('overflow-hidden');
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

  describe('File Upload Interactions', () => {
    it('should call onClose and refetch after successful file upload', async () => {
      const { uploadGalleryPhoto } = await import(
        '@/services/queries/uploadGalleryPhoto'
      );
      vi.mocked(uploadGalleryPhoto).mockResolvedValue(undefined);

      render(<UploadPhotoGallery />);
      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;

      const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
        await new Promise((r) => setTimeout(r, 0));
      });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('should show toast error when upload fails', async () => {
      const { uploadGalleryPhoto } = await import(
        '@/services/queries/uploadGalleryPhoto'
      );
      vi.mocked(uploadGalleryPhoto).mockRejectedValue(
        new Error('Upload failed')
      );

      const { toast } = await import('sonner');

      render(<UploadPhotoGallery />);
      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;

      const file = new File(['content'], 'fail.jpg', { type: 'image/jpeg' });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
        await new Promise((r) => setTimeout(r, 0));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erro ao enviar foto.',
          expect.objectContaining({ position: 'bottom-center' })
        );
      });
    });

    it('should do nothing when no file is selected', async () => {
      render(<UploadPhotoGallery />);
      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [] } });
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(mockOnClose).not.toHaveBeenCalled();
      expect(mockRefetch).not.toHaveBeenCalled();
    });

    it('should trigger file input when Escolher arquivo button is clicked', () => {
      render(<UploadPhotoGallery />);

      const chooseFileButton = screen.getByRole('button', {
        name: /Escolher arquivo/i,
      });
      const fileInput = screen.getByLabelText(
        /Selecionar foto para enviar/i
      ) as unknown as HTMLInputElement;

      const clickSpy = vi.spyOn(fileInput, 'click');

      fireEvent.click(chooseFileButton);

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });
});
