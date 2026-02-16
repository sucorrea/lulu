import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import PhotoCameraUploader from './photo-camera-uploader';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />;
  },
}));

vi.mock('lucide-react', () => ({
  Camera: () => <span data-testid="camera-icon">Camera Icon</span>,
}));

describe('PhotoCameraUploader', () => {
  let mockMediaStream: Partial<MediaStream>;
  let mockGetUserMedia: ReturnType<typeof vi.fn>;
  let mockGetContext: ReturnType<typeof vi.fn>;
  let mockDrawImage: ReturnType<typeof vi.fn>;
  let mockToDataURL: ReturnType<typeof vi.fn>;
  let mockCanvasElement: Partial<HTMLCanvasElement>;
  let mockFileReader: Partial<FileReader>;
  let alertSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockDrawImage = vi.fn();
    mockToDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,mock');
    mockGetContext = vi.fn().mockReturnValue({
      drawImage: mockDrawImage,
    });

    mockCanvasElement = {
      getContext: mockGetContext,
      toDataURL: mockToDataURL,
      width: 0,
      height: 0,
    };

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        if (tagName === 'canvas') {
          return mockCanvasElement as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      }
    );

    mockMediaStream = {
      getTracks: vi.fn().mockReturnValue([
        {
          stop: vi.fn(),
        },
      ]),
    };

    mockGetUserMedia = vi.fn().mockResolvedValue(mockMediaStream);

    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      configurable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    });

    vi.spyOn(globalThis, 'FileReader').mockImplementation(() => {
      const newFileReader: Partial<FileReader> = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onload) {
              const event = {
                target: { result: 'data:image/jpeg;base64,mockfile' },
              } as ProgressEvent<FileReader>;
              this.onload(event);
            }
          }, 0);
        }),
        onload: null,
        result: 'data:image/jpeg;base64,mockfile',
        error: null,
      };
      mockFileReader = newFileReader;
      return newFileReader as FileReader;
    });

    alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render initial state with upload and camera buttons', () => {
      render(<PhotoCameraUploader />);

      expect(
        screen.getByText('Selecione uma foto ou use a câmera')
      ).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Câmera/i })
      ).toBeInTheDocument();
    });

    it('should render with correct container classes', () => {
      const { container } = render(<PhotoCameraUploader />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('w-full', 'max-w-md', 'mx-auto');
    });

    it('should render camera icon', () => {
      render(<PhotoCameraUploader />);

      expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    });

    it('should have hidden file input', () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput).toHaveClass('hidden');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('should render flex layout for button container', () => {
      const { container } = render(<PhotoCameraUploader />);

      const buttonContainer = container.querySelector(
        '.flex.justify-center.gap-4'
      );
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have hover effects on buttons', () => {
      render(<PhotoCameraUploader />);

      const uploadLabel = screen.getByText('Upload').parentElement;
      expect(uploadLabel).toHaveClass(
        'hover:bg-primary/90',
        'transition-colors'
      );

      const cameraButton = screen.getByRole('button', { name: /Câmera/i });
      expect(cameraButton).toHaveClass(
        'hover:bg-secondary/90',
        'transition-colors'
      );
    });
  });

  describe('File Upload', () => {
    it('should handle file upload and display photo', async () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByAltText('Foto do usuário')).toBeInTheDocument();
      });
    });

    it('should not upload when no file is selected', () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [] } });

      expect(screen.queryByAltText('Foto do usuário')).not.toBeInTheDocument();
    });

    it('should read file as data URL', () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    });

    it('should handle null files', () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: null } });

      expect(screen.queryByAltText('Foto do usuário')).not.toBeInTheDocument();
    });

    it('should display uploaded photo with correct image attributes', async () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const img = screen.getByAltText(
          'Foto do usuário'
        ) as unknown as HTMLImageElement;
        expect(img).toHaveAttribute('width', '500');
        expect(img).toHaveAttribute('height', '500');
        expect(img).toHaveClass('w-full', 'h-auto', 'rounded-lg');
      });
    });
  });

  describe('Camera Operations', () => {
    it('should call getUserMedia when opening camera', async () => {
      render(<PhotoCameraUploader />);

      const cameraButton = screen.getByRole('button', { name: /Câmera/i });
      fireEvent.click(cameraButton);

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      });
    });

    it('should handle camera access error', async () => {
      mockGetUserMedia.mockRejectedValue(new Error('Camera access denied'));

      render(<PhotoCameraUploader />);

      const cameraButton = screen.getByRole('button', { name: /Câmera/i });
      fireEvent.click(cameraButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erro ao acessar a câmera:',
          expect.any(Error)
        );
        expect(alertSpy).toHaveBeenCalledWith(
          'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
        );
      });
    });

    it('should not show camera UI when videoRef is not available', async () => {
      mockGetUserMedia.mockResolvedValue(mockMediaStream);

      render(<PhotoCameraUploader />);

      const cameraButton = screen.getByRole('button', { name: /Câmera/i });
      fireEvent.click(cameraButton);

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalled();
      });

      expect(
        screen.queryByRole('button', { name: /Capturar/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Photo Display and Removal', () => {
    it('should display remove button with correct styles', async () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        const removeButton = screen.getByRole('button', { name: /Remover/i });
        expect(removeButton).toHaveClass(
          'bg-red-500',
          'text-white',
          'p-2',
          'rounded-full'
        );
      });
    });

    it('should remove photo when remove button is clicked', async () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByAltText('Foto do usuário')).toBeInTheDocument();
      });

      const removeButton = screen.getByRole('button', { name: /Remover/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(
          screen.getByText('Selecione uma foto ou use a câmera')
        ).toBeInTheDocument();
      });
    });

    it('should handle multiple file uploads', async () => {
      const { container } = render(<PhotoCameraUploader />);

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file1 = new File(['content1'], 'test1.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file1] } });

      await waitFor(() => {
        expect(screen.getByAltText('Foto do usuário')).toBeInTheDocument();
      });

      const removeButton = screen.getByRole('button', { name: /Remover/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(
          screen.getByText('Selecione uma foto ou use a câmera')
        ).toBeInTheDocument();
      });

      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file2] } });

      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file2);
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct border and padding styles in initial state', () => {
      const { container } = render(<PhotoCameraUploader />);

      const borderedDiv = container.querySelector('.border-2');
      expect(borderedDiv).toHaveClass(
        'border-dashed',
        'border-gray-300',
        'rounded-lg',
        'p-8',
        'text-center'
      );
    });

    it('should have correct button styles', () => {
      render(<PhotoCameraUploader />);

      const uploadLabel = screen.getByText('Upload').parentElement;
      expect(uploadLabel).toHaveClass(
        'bg-primary',
        'text-white',
        'px-4',
        'py-2',
        'rounded-md',
        'cursor-pointer'
      );

      const cameraButton = screen.getByRole('button', { name: /Câmera/i });
      expect(cameraButton).toHaveClass(
        'bg-secondary',
        'text-white',
        'px-4',
        'py-2',
        'rounded-md',
        'flex',
        'items-center',
        'gap-2'
      );
    });
  });
});
