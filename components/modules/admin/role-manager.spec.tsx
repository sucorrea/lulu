import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoleManager } from './role-manager';

const mockUpdateRole = vi.fn();
const mockRemoveParticipant = vi.fn();
const mockUseGetAll = vi.fn();

vi.mock('@/services/queries/adminParticipants', () => ({
  useGetAllParticipantsAdmin: () => mockUseGetAll(),
  useUpdateParticipantRole: () => ({ mutate: mockUpdateRole }),
  useDeleteParticipant: () => ({ mutate: mockRemoveParticipant }),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => ({
    user: { uid: 'admin-1', getIdToken: vi.fn().mockResolvedValue('token') },
    isLogged: true,
    isAdmin: true,
    isLulu: false,
    role: 'admin',
    participantId: undefined,
    isLoading: false,
    handleLogout: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('RoleManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseGetAll.mockReturnValue({ data: undefined, isLoading: true });
    render(<RoleManager />);
    expect(screen.getByText('Carregando participantes...')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseGetAll.mockReturnValue({ data: [], isLoading: false });
    render(<RoleManager />);
    expect(
      screen.getByText('Nenhuma participante encontrada.')
    ).toBeInTheDocument();
  });

  it('should render participants list', () => {
    mockUseGetAll.mockReturnValue({
      data: [
        {
          docId: '1',
          name: 'Alice',
          fullName: 'Alice Silva',
          role: 'lulu',
          authEmail: 'alice@test.com',
        },
        {
          docId: '2',
          name: 'Bob',
          fullName: '',
          role: 'visitante',
        },
      ],
      isLoading: false,
    });

    render(<RoleManager />);

    expect(screen.getByText('Alice Silva')).toBeInTheDocument();
    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Sem e-mail vinculado')).toBeInTheDocument();
  });

  it('should call handleDelete with confirm', async () => {
    mockUseGetAll.mockReturnValue({
      data: [
        {
          docId: '1',
          name: 'Alice',
          fullName: 'Alice Silva',
          role: 'lulu',
        },
      ],
      isLoading: false,
    });

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<RoleManager />);

    fireEvent.click(screen.getByLabelText('Remover Alice'));

    await waitFor(() => {
      expect(mockRemoveParticipant).toHaveBeenCalledWith(
        '1',
        expect.any(Object)
      );
    });
  });

  it('should not delete when confirm is cancelled', () => {
    mockUseGetAll.mockReturnValue({
      data: [{ docId: '1', name: 'Alice', fullName: '', role: 'lulu' }],
      isLoading: false,
    });

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<RoleManager />);

    fireEvent.click(screen.getByLabelText('Remover Alice'));

    expect(mockRemoveParticipant).not.toHaveBeenCalled();
  });

  it('should show null state when data is undefined', () => {
    mockUseGetAll.mockReturnValue({ data: undefined, isLoading: false });
    render(<RoleManager />);
    expect(
      screen.getByText('Nenhuma participante encontrada.')
    ).toBeInTheDocument();
  });
});
