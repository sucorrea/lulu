import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UpdateParticipantPhoto from './upload-file-form';

const mockUseUploadPhoto = vi.fn();

vi.mock('@/hooks/useUploadPhoto', () => ({
  useUploadPhoto: (participantId: string) => mockUseUploadPhoto(participantId),
}));

describe('UpdateParticipantPhoto', () => {
  const mockSetFile = vi.fn();
  const participantId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUploadPhoto.mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  });

  it('should render file input label', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.getByText('Escolher foto')).toBeInTheDocument();
  });

  it('should render hidden file input', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveStyle({ display: 'none' });
  });

  it('should call setFile when file is selected', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockSetFile).toHaveBeenCalledWith(file);
  });

  it('should not call setFile when no file is selected', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    fireEvent.change(input, { target: { files: [] } });

    expect(mockSetFile).not.toHaveBeenCalled();
  });

  it('should display uploading message when isPending is true', () => {
    mockUseUploadPhoto.mockReturnValue({
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('should display success message when isSuccess is true', () => {
    mockUseUploadPhoto.mockReturnValue({
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.getByText('Foto Alterada')).toBeInTheDocument();
  });

  it('should display error cause when isError is true', () => {
    mockUseUploadPhoto.mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: true,
      error: { cause: 'Upload failed', message: 'Network error' },
    });

    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.getByText('Error: "Upload failed"')).toBeInTheDocument();
  });

  it('should display error message when isError is true', () => {
    mockUseUploadPhoto.mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: true,
      error: { cause: 'Upload failed', message: 'Network error' },
    });

    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.getByText('Error: "Network error"')).toBeInTheDocument();
  });

  it('should apply correct spacing classes', () => {
    const { container } = render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('space-y-2', 'p-6', 'cursor-pointer');
  });

  it('should call useUploadPhoto with participantId', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(mockUseUploadPhoto).toHaveBeenCalledWith(participantId);
  });

  it('should handle multiple file selections', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    const file1 = new File(['content1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file1] } });
    expect(mockSetFile).toHaveBeenCalledWith(file1);

    fireEvent.change(input, { target: { files: [file2] } });
    expect(mockSetFile).toHaveBeenCalledWith(file2);
  });

  it('should have file-upload id on input', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    expect(input).toHaveAttribute('id', 'file-upload');
  });

  it('should not display messages when all states are false', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Foto Alterada')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it('should handle error with undefined properties', () => {
    mockUseUploadPhoto.mockReturnValue({
      isPending: false,
      isSuccess: false,
      isError: true,
      error: { cause: undefined, message: undefined },
    });

    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const errorMessages = screen.getAllByText(/Error:/);
    expect(errorMessages).toHaveLength(2);
  });

  it('should accept only image files', () => {
    render(
      <UpdateParticipantPhoto
        participantId={participantId}
        setFile={mockSetFile}
      />
    );

    const input = screen.getByLabelText('Escolher foto');
    expect(input).toHaveAttribute('accept', 'image/*');
  });
});
