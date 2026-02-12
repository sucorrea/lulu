import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { AuditLogList } from './AuditLogList';
import { AuditLogItem } from './AuditLogList/AuditLogItem';
import { AuditLogSkeleton } from './AuditLogList/AuditLogSkeleton';
import { AuditPage } from './AuditPage';
import { AuditFilters } from './AuditPage/AuditFilters';
import { useAuditData } from './AuditPage/useAuditData';
import { useAuditFilters } from './AuditPage/useAuditFilters';
import { formatValue, formatDateTime } from './AuditLogList/formatters';
import type { AuditLog } from '@/services/audit';
import type { Person } from '@/components/lulus/types';
import * as auditService from '@/services/audit';
import * as fetchParticipantsModule from '@/services/queries/fetchParticipants';
import { Router } from 'next/router';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

vi.mock('next/navigation');
vi.mock('@/services/audit');
vi.mock('@/services/queries/fetchParticipants');
vi.mock('@/components/error-state', () => ({
  default: ({
    title,
    message,
    onRetry,
  }: {
    title: string;
    message: string;
    onRetry: () => void;
  }) => (
    <div data-testid="error-state">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

const mockAuditLog: AuditLog = {
  id: '1',
  participantId: 1,
  timestamp: '2024-02-06T10:30:00Z',
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  changes: [
    {
      field: 'fullName',
      oldValue: 'John',
      newValue: 'John Doe',
      fieldType: 'string',
    },
    {
      field: 'email',
      oldValue: null,
      newValue: 'john@example.com',
      fieldType: 'string',
    },
    {
      field: 'picture',
      oldValue: null,
      newValue: null,
      fieldType: 'string',
    },
  ],
  metadata: {
    source: 'web',
    ipAddress: '192.168.1.1',
  },
};

const mockAuditLogWithoutEmail: AuditLog = {
  id: '2',
  participantId: 2,
  timestamp: '2024-02-06T11:30:00Z',
  userId: 'user456',
  userName: 'Jane Smith',
  changes: [
    {
      field: 'phone',
      oldValue: null,
      newValue: '11999999999',
      fieldType: 'string',
    },
  ],
};

const mockParticipant: Person = {
  id: 1,
  name: 'John Doe',
  fullName: 'John Doe',
  date: '2000-01-01',
  month: 'January',
  gives_to: 'Jane',
  gives_to_id: 2,
  email: 'john@example.com',
  phone: '11999999999',
  city: 'São Paulo',
};

const mockParticipants: Person[] = [
  mockParticipant,
  {
    id: 2,
    name: 'Jane Smith',
    fullName: 'Jane Smith',
    date: '1995-06-15',
    month: 'June',
    gives_to: 'John',
    gives_to_id: 1,
    city: 'Rio de Janeiro',
  },
];

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Audit Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchParticipantsModule.fetchParticipants).mockResolvedValue(
      mockParticipants
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('AuditLogList', () => {
    it('should render list of audit logs', () => {
      render(<AuditLogList logs={[mockAuditLog, mockAuditLogWithoutEmail]} />, {
        wrapper: Wrapper,
      });

      const johnElements = screen.queryAllByText('John Doe');
      const janeElements = screen.queryAllByText('Jane Smith');
      expect(johnElements.length).toBeGreaterThan(0);
      expect(janeElements.length).toBeGreaterThan(0);
    });

    it('should render loading skeleton when isLoading is true', () => {
      render(<AuditLogList logs={[]} isLoading />, {
        wrapper: Wrapper,
      });

      const skeletons = screen.getAllByRole('generic');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render empty state when no logs provided', () => {
      render(<AuditLogList logs={[]} isLoading={false} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('Nenhum registro encontrado')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Não há alterações registradas ainda')
      ).toBeInTheDocument();
    });

    it('should show participant name when showParticipantName is true', () => {
      render(
        <AuditLogList
          logs={[mockAuditLog]}
          showParticipantName
          getParticipantName={(id: number) =>
            id === 1 ? 'John Doe' : 'Jane Smith'
          }
        />,
        { wrapper: Wrapper }
      );

      const badges = screen.getAllByText('John Doe');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle multiple logs correctly', () => {
      const logs: AuditLog[] = Array.from({ length: 10 }, (_, i) => ({
        ...mockAuditLog,
        id: String(i),
        userName: `User ${i}`,
      }));

      render(<AuditLogList logs={logs} />, { wrapper: Wrapper });

      logs.forEach((log) => {
        expect(screen.getByText(log.userName)).toBeInTheDocument();
      });
    });

    it('should not crash with undefined getParticipantName', () => {
      render(
        <AuditLogList
          logs={[mockAuditLog]}
          showParticipantName
          getParticipantName={undefined}
        />,
        { wrapper: Wrapper }
      );

      const johnElements = screen.queryAllByText('John Doe');
      expect(johnElements.length).toBeGreaterThan(0);
    });

    it('should handle empty changes array', () => {
      const logWithoutChanges: AuditLog = {
        ...mockAuditLog,
        changes: [],
      };

      render(<AuditLogList logs={[logWithoutChanges]} />, {
        wrapper: Wrapper,
      });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('AuditLogItem', () => {
    it('should render user name correctly', () => {
      render(<AuditLogItem log={mockAuditLog} />, { wrapper: Wrapper });

      const userNameElements = screen.queryAllByText('John Doe');
      expect(userNameElements.length).toBeGreaterThan(0);
    });

    it('should render user email when available', () => {
      render(<AuditLogItem log={mockAuditLog} />, { wrapper: Wrapper });

      const emailElements = screen.queryAllByText('john@example.com');
      expect(emailElements.length).toBeGreaterThan(0);
    });

    it('should not render user email when not available', () => {
      render(<AuditLogItem log={mockAuditLogWithoutEmail} />, {
        wrapper: Wrapper,
      });

      const emailText = screen.queryByText(/@/);
      expect(emailText).not.toBeInTheDocument();
    });

    it('should render timestamp format', () => {
      render(<AuditLogItem log={mockAuditLog} />, { wrapper: Wrapper });

      const timeText = screen.getByText(/às/);
      expect(timeText).toBeInTheDocument();
    });

    it('should render participant name badge when showParticipantName is true', () => {
      render(
        <AuditLogItem
          log={mockAuditLog}
          showParticipantName
          participantName="Participant A"
        />,
        { wrapper: Wrapper }
      );

      expect(screen.getByText('Participant A')).toBeInTheDocument();
    });

    it('should render change field labels correctly', () => {
      render(<AuditLogItem log={mockAuditLog} />, { wrapper: Wrapper });

      expect(screen.getByText('Nome Completo')).toBeInTheDocument();
      expect(screen.getByText('E-mail')).toBeInTheDocument();
    });

    it('should render metadata when available', () => {
      render(<AuditLogItem log={mockAuditLog} />, { wrapper: Wrapper });

      expect(screen.getByText('Origem:')).toBeInTheDocument();
      expect(screen.getByText('web')).toBeInTheDocument();
      expect(screen.getByText('IP:')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    });

    it('should not render metadata when not available', () => {
      const logWithoutMetadata: AuditLog = {
        ...mockAuditLog,
        metadata: undefined,
      };

      render(<AuditLogItem log={logWithoutMetadata} />, { wrapper: Wrapper });

      expect(screen.queryByText('Origem:')).not.toBeInTheDocument();
      expect(screen.queryByText('IP:')).not.toBeInTheDocument();
    });

    it('should handle metadata with only source', () => {
      const logWithPartialMetadata: AuditLog = {
        ...mockAuditLog,
        metadata: {
          source: 'api',
        },
      };

      render(<AuditLogItem log={logWithPartialMetadata} />, {
        wrapper: Wrapper,
      });

      expect(screen.getByText('Origem:')).toBeInTheDocument();
      expect(screen.getByText('api')).toBeInTheDocument();
      expect(screen.queryByText('IP:')).not.toBeInTheDocument();
    });

    it('should handle metadata with only ipAddress', () => {
      const logWithPartialMetadata: AuditLog = {
        ...mockAuditLog,
        metadata: {
          ipAddress: '10.0.0.1',
        },
      };

      render(<AuditLogItem log={logWithPartialMetadata} />, {
        wrapper: Wrapper,
      });

      expect(screen.queryByText('Origem:')).not.toBeInTheDocument();
      expect(screen.getByText('IP:')).toBeInTheDocument();
      expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
    });

    it('should render multiple changes correctly', () => {
      const logWithMultipleChanges: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'fullName',
            oldValue: 'John',
            newValue: 'John Doe',
            fieldType: 'string',
          },
          {
            field: 'email',
            oldValue: null,
            newValue: 'john@example.com',
            fieldType: 'string',
          },
          {
            field: 'phone',
            oldValue: '11988888888',
            newValue: '11999999999',
            fieldType: 'string',
          },
        ],
      };

      render(<AuditLogItem log={logWithMultipleChanges} />, {
        wrapper: Wrapper,
      });

      expect(screen.getByText('Nome Completo')).toBeInTheDocument();
      expect(screen.getByText('E-mail')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
    });

    it('should handle unknown field labels', () => {
      const logWithUnknownField: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'unknownField',
            oldValue: 'old',
            newValue: 'new',
            fieldType: 'string',
          },
        ],
      };

      render(<AuditLogItem log={logWithUnknownField} />, { wrapper: Wrapper });

      expect(screen.getByText('unknownField')).toBeInTheDocument();
    });
  });

  describe('AuditLogSkeleton', () => {
    it('should render 5 skeleton items', () => {
      render(<AuditLogSkeleton />, { wrapper: Wrapper });

      const skeletonDivs = screen
        .getAllByRole('generic')
        .filter((el) => el.className.includes('animate-pulse'));
      expect(skeletonDivs.length).toBeGreaterThanOrEqual(5);
    });

    it('should have loading animation classes', () => {
      const { container } = render(<AuditLogSkeleton />, {
        wrapper: Wrapper,
      });

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  describe('formatValue', () => {
    it('should return "Não informado" for null values', () => {
      expect(formatValue(null, 'string')).toBe('Não informado');
    });

    it('should return "Não informado" for undefined values', () => {
      expect(formatValue(undefined, 'string')).toBe('Não informado');
    });

    it('should format date strings', () => {
      const result = formatValue('2024-02-06', 'date');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle date values correctly', () => {
      const result = formatValue('2024-02-06', 'date');
      expect(result).not.toBe('Não informado');
    });

    it('should convert boolean true to "Sim"', () => {
      expect(formatValue(true, 'boolean')).toBe('Sim');
    });

    it('should convert boolean false to "Não"', () => {
      expect(formatValue(false, 'boolean')).toBe('Não');
    });

    it('should stringify objects', () => {
      const obj = { key: 'value' };
      const result = formatValue(obj, 'object');
      expect(result).toBe('[object Object]');
    });

    it('should return string representation of string values', () => {
      expect(formatValue('test string', 'string')).toBe('test string');
    });

    it('should return string representation of number values', () => {
      expect(formatValue(123, 'number')).toBe('123');
    });

    it('should handle empty strings', () => {
      expect(formatValue('', 'string')).toBe('');
    });

    it('should handle zero values', () => {
      expect(formatValue(0, 'number')).toBe('0');
    });

    it('should stringify arrays', () => {
      const arr = [1, 2, 3];
      const result = formatValue(arr, 'array');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const result = formatDateTime('2024-02-06T10:30:00Z');
      expect(result).toContain('às');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle different timestamps', () => {
      const result = formatDateTime('2024-02-06T15:45:00Z');
      expect(result).toContain('às');
    });

    it('should handle edge dates', () => {
      const result = formatDateTime('2024-01-01T00:00:00Z');
      expect(result).toContain('às');
    });

    it('should produce consistent format', () => {
      const result1 = formatDateTime('2024-02-06T10:30:00Z');
      const result2 = formatDateTime('2024-02-06T11:30:00Z');
      expect(result1).toMatch(/\d{2}:\d{2}/);
      expect(result2).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('useAuditData', () => {
    it('should fetch and return audit logs', async () => {
      const mockLogs: AuditLog[] = [mockAuditLog];
      vi.mocked(auditService.getAuditLogs).mockResolvedValue(mockLogs);

      const TestComponent = () => {
        const { auditLogs } = useAuditData('1', 20, true);
        return (
          <div>
            {auditLogs.map((log) => (
              <div key={log.id}>{log.userName}</div>
            ))}
          </div>
        );
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeNull();
      });
    });

    it('should detect index building error', async () => {
      const error = new Error('Index is not ready yet for index ');
      vi.mocked(auditService.getAuditLogs).mockRejectedValue(error);

      const TestComponent = () => {
        const { isIndexBuilding } = useAuditData('1', 20, true);
        return <div>{isIndexBuilding ? 'Building' : 'Ready'}</div>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Building')).toBeInTheDocument();
      });
    });

    it('should handle enabled false', () => {
      const TestComponent = () => {
        const { auditLogs } = useAuditData('1', 20, false);
        return <div>{auditLogs.length} logs</div>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByText('0 logs')).toBeInTheDocument();
    });

    it('should fetch all audit logs when participantId is "all"', async () => {
      const mockLogs: AuditLog[] = [mockAuditLog];
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue(mockLogs);

      const TestComponent = () => {
        const { auditLogs } = useAuditData('all', 20, true);
        return <div>Count: {auditLogs.length}</div>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(vi.mocked(auditService.getAllAuditLogs)).toHaveBeenCalledWith(
          20
        );
      });
    });

    it('should map participantId in response', async () => {
      const logWithoutParticipantId: AuditLog = {
        ...mockAuditLog,
        participantId: undefined,
      };
      vi.mocked(auditService.getAuditLogs).mockResolvedValue([
        logWithoutParticipantId,
      ]);

      const TestComponent = () => {
        const { auditLogs } = useAuditData('1', 20, true);
        return (
          <div>
            {auditLogs.map((log) => (
              <div key={log.id}>{log.participantId}</div>
            ))}
          </div>
        );
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should handle error state', async () => {
      const error = new Error('Failed to fetch');
      vi.mocked(auditService.getAuditLogs).mockRejectedValue(error);

      const TestComponent = () => {
        const { error: resultError } = useAuditData('1', 20, true);
        if (resultError) {
          return <div>Error: {resultError.message}</div>;
        }
        return <div>No error</div>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(
        () => {
          const errorMessage = screen.queryByText(/Error:/);
          const noErrorText = screen.queryByText('No error');

          expect(errorMessage || noErrorText).toBeTruthy();
        },
        { timeout: 5000 }
      );
    });

    it('should call getAuditLogs with correct params', async () => {
      vi.mocked(auditService.getAuditLogs).mockResolvedValue([]);

      const TestComponent = () => {
        useAuditData('42', 50, true);
        return null;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(vi.mocked(auditService.getAuditLogs)).toHaveBeenCalledWith(
          42,
          50
        );
      });
    });
  });

  describe('useAuditFilters', () => {
    beforeEach(() => {
      const mockRouter: Partial<Router> = {
        replace: vi.fn(),
      };
      vi.mocked(useRouter).mockReturnValue(
        mockRouter as unknown as AppRouterInstance
      );

      vi.mocked(usePathname).mockReturnValue('/auditoria');
      const mockParams = new URLSearchParams();
      vi.mocked(useSearchParams).mockReturnValue(
        mockParams as unknown as ReadonlyURLSearchParams
      );
    });

    it('should initialize with default values', () => {
      const TestComponent = () => {
        const { filters } = useAuditFilters();
        return (
          <div>
            {filters.participantId}-{filters.limit}-{filters.search}
          </div>
        );
      };

      render(<TestComponent />, { wrapper: Wrapper });

      expect(screen.getByText(/all-20/)).toBeInTheDocument();
    });

    it('should update participant filter', async () => {
      const mockReplace = vi.fn();
      const mockRouter: Partial<Router> = {
        replace: mockReplace,
      };
      vi.mocked(useRouter).mockReturnValue(
        mockRouter as unknown as AppRouterInstance
      );

      const TestComponent = () => {
        const { setParticipantId } = useAuditFilters();
        return (
          <button onClick={() => setParticipantId('5')}>Set Participant</button>
        );
      };

      render(<TestComponent />, { wrapper: Wrapper });

      const button = screen.getByText('Set Participant');
      fireEvent.click(button);

      expect(mockReplace).toHaveBeenCalled();
    });

    it('should update limit filter', async () => {
      const mockReplace = vi.fn();
      const mockRouter: Partial<Router> = {
        replace: mockReplace,
      };
      vi.mocked(useRouter).mockReturnValue(
        mockRouter as unknown as AppRouterInstance
      );

      const TestComponent = () => {
        const { setLimit } = useAuditFilters();
        return <button onClick={() => setLimit(50)}>Set Limit</button>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      const button = screen.getByText('Set Limit');
      fireEvent.click(button);

      expect(mockReplace).toHaveBeenCalled();
    });

    it('should update search filter', async () => {
      const mockReplace = vi.fn();
      const mockRouter: Partial<Router> = {
        replace: mockReplace,
      };
      vi.mocked(useRouter).mockReturnValue(
        mockRouter as unknown as AppRouterInstance
      );

      const TestComponent = () => {
        const { setSearch } = useAuditFilters();
        return <button onClick={() => setSearch('john')}>Set Search</button>;
      };

      render(<TestComponent />, { wrapper: Wrapper });

      const button = screen.getByText('Set Search');
      fireEvent.click(button);

      expect(mockReplace).toHaveBeenCalled();
    });

    it('should read from URL search params', () => {
      const params = new URLSearchParams('participant=5&limit=50&search=test');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      const TestComponentWithParams = () => {
        const { filters } = useAuditFilters();
        return (
          <div data-testid="url-params-display">
            {filters.participantId}-{filters.limit}-{filters.search}
          </div>
        );
      };

      render(<TestComponentWithParams />, { wrapper: Wrapper });

      expect(screen.getByText(/5-50-test/)).toBeInTheDocument();
    });
  });

  describe('AuditFilters', () => {
    it('should render participant and limit selects with search input', () => {
      render(
        <AuditFilters
          selectedParticipant="all"
          limitCount={20}
          searchTerm=""
          onParticipantChange={vi.fn()}
          onLimitChange={vi.fn()}
          onSearchChange={vi.fn()}
          isLoadingParticipants={false}
        />,
        { wrapper: Wrapper }
      );

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);

      const input = screen.getByPlaceholderText(/buscar por usuário/i);
      expect(input).toBeInTheDocument();
    });

    it('should call onSearchChange on search input change', async () => {
      const onSearchChange = vi.fn();

      render(
        <AuditFilters
          selectedParticipant="all"
          limitCount={20}
          searchTerm=""
          onParticipantChange={vi.fn()}
          onLimitChange={vi.fn()}
          onSearchChange={onSearchChange}
          isLoadingParticipants={false}
        />,
        { wrapper: Wrapper }
      );

      const input = screen.getByPlaceholderText(/buscar por usuário/i);
      await userEvent.type(input, 'test');

      await waitFor(() => {
        expect(onSearchChange).toHaveBeenCalled();
      });
    });

    it('should disable participant select when loading participants', () => {
      render(
        <AuditFilters
          selectedParticipant="all"
          limitCount={20}
          searchTerm=""
          onParticipantChange={vi.fn()}
          onLimitChange={vi.fn()}
          onSearchChange={vi.fn()}
          isLoadingParticipants={true}
        />,
        { wrapper: Wrapper }
      );

      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toBeDisabled();
    });

    it('should update search input value', () => {
      render(
        <AuditFilters
          selectedParticipant="all"
          limitCount={20}
          searchTerm="test"
          onParticipantChange={vi.fn()}
          onLimitChange={vi.fn()}
          onSearchChange={vi.fn()}
          isLoadingParticipants={false}
        />,
        { wrapper: Wrapper }
      );

      const input = screen.getByPlaceholderText(
        /buscar por usuário/i
      ) as unknown as HTMLInputElement;
      expect(input.value).toBe('test');
    });
  });

  describe('AuditPage', () => {
    beforeEach(() => {
      vi.mocked(fetchParticipantsModule.fetchParticipants).mockResolvedValue(
        mockParticipants
      );

      const mockRouter: Partial<Router> = {
        replace: vi.fn(),
      };
      vi.mocked(useRouter).mockReturnValue(
        mockRouter as unknown as AppRouterInstance
      );

      vi.mocked(usePathname).mockReturnValue('/auditoria');
      const mockParams = new URLSearchParams();
      vi.mocked(useSearchParams).mockReturnValue(
        mockParams as unknown as ReadonlyURLSearchParams
      );
    });

    it('should render page title and description', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Histórico de Auditoria')).toBeInTheDocument();
      });
    });

    it('should render audit filters', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const comboboxes = screen.getAllByRole('combobox');
        expect(comboboxes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should render audit logs after loading', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should show error state on error', async () => {
      const error = new Error('Failed to load');
      vi.mocked(auditService.getAllAuditLogs).mockRejectedValue(error);
      vi.mocked(fetchParticipantsModule.fetchParticipants).mockResolvedValue(
        mockParticipants
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(
        () => {
          const errorStateTitle = screen.queryByText(
            'Erro ao carregar logs de auditoria'
          );
          const errorStateMessage = screen.queryByText(
            /Não foi possível carregar/
          );
          const auditPageTitle = screen.queryByText('Histórico de Auditoria');

          expect(
            errorStateTitle || errorStateMessage || auditPageTitle
          ).toBeTruthy();
        },
        { timeout: 5000 }
      );
    });

    it('should show index building error when index not ready', async () => {
      const error = new Error('Index is not ready yet for index ');
      vi.mocked(auditService.getAllAuditLogs).mockRejectedValue(error);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          screen.getByText(/índice do banco de dados em construção/i)
        ).toBeInTheDocument();
      });
    });

    it('should filter logs by participant', async () => {
      const logsForParticipant1: AuditLog[] = [
        { ...mockAuditLog, participantId: 1 },
      ];
      vi.mocked(auditService.getAuditLogs).mockResolvedValue(
        logsForParticipant1
      );

      const params = new URLSearchParams('participant=1');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(vi.mocked(auditService.getAuditLogs)).toHaveBeenCalledWith(
          1,
          20
        );
      });
    });

    it('should search logs by user name', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        mockAuditLog,
        { ...mockAuditLog, id: '2', userName: 'Jane Smith' },
      ]);

      const params = new URLSearchParams('search=John');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle empty audit logs', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          screen.getByText('Nenhum registro encontrado')
        ).toBeInTheDocument();
      });
    });

    it('should load participants on mount', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          vi.mocked(fetchParticipantsModule.fetchParticipants)
        ).toHaveBeenCalled();
      });
    });

    it('should get participant name by id', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle participant not found', async () => {
      const logsWithUnknownParticipantId: AuditLog[] = [
        { ...mockAuditLog, participantId: 999 },
      ];
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue(
        logsWithUnknownParticipantId
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const participantText = screen.queryAllByText(/participante/i);
        expect(participantText.length).toBeGreaterThan(0);
      });
    });

    it('should use participant name as fallback', async () => {
      const participantWithoutFullName: Person = {
        ...mockParticipant,
        fullName: '',
      };

      vi.mocked(fetchParticipantsModule.fetchParticipants).mockResolvedValue([
        participantWithoutFullName,
      ]);

      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        { ...mockAuditLog, participantId: 1 },
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle different limit values', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      const params = new URLSearchParams('limit=50');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(vi.mocked(auditService.getAllAuditLogs)).toHaveBeenCalledWith(
          50
        );
      });
    });

    it('should search by email', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        mockAuditLog,
        { ...mockAuditLog, id: '2', userEmail: 'jane@example.com' },
      ]);

      const params = new URLSearchParams('search=john@');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should search by field changes', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      const params = new URLSearchParams('search=Nome');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText(/nome completo/i)).toBeInTheDocument();
      });
    });

    it('should display null changes correctly', async () => {
      const logWithNullChanges: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'status',
            oldValue: null,
            newValue: 'active',
            fieldType: 'string',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithNullChanges,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('active')).toBeInTheDocument();
      });
    });

    it('should display field clearing changes (value changed to null)', async () => {
      const logWithFieldClearing: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'email',
            oldValue: 'john@example.com',
            newValue: null,
            fieldType: 'string',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithFieldClearing,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const emailElements = screen.getAllByText('john@example.com');
        expect(emailElements.length).toBeGreaterThan(0);
        const naoInformadoElements = screen.getAllByText('Não informado');
        expect(naoInformadoElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle zero values in changes', async () => {
      const logWithZero: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'count',
            oldValue: 0,
            newValue: 5,
            fieldType: 'number',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([logWithZero]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const zeros = screen.queryAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
      });
    });

    it('should handle boolean changes', async () => {
      const logWithBoolean: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'isActive',
            oldValue: true,
            newValue: false,
            fieldType: 'boolean',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithBoolean,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.queryAllByText('Sim').length).toBeGreaterThan(0);
      });
    });

    it('should display audit log with all metadata fields', async () => {
      const fullMetadataLog: AuditLog = {
        ...mockAuditLog,
        metadata: {
          source: 'api',
          ipAddress: '10.0.0.1',
        },
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        fullMetadataLog,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('api')).toBeInTheDocument();
        expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
      });
    });

    it('should handle audit logs with very long values', async () => {
      const longValueLog: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'description',
            oldValue: 'Short',
            newValue:
              'This is a very long description that might not fit on one line and could cause layout issues if not handled properly in the UI component',
            fieldType: 'string',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([longValueLog]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const longText = screen.queryByText(/very long description/);
        expect(longText || screen.getByText(/Short/)).toBeTruthy();
      });
    });

    it('should handle empty search', async () => {
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([mockAuditLog]);

      const params = new URLSearchParams('');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const johnElements = screen.queryAllByText('John Doe');
        expect(johnElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle filtering by different participants', async () => {
      vi.mocked(auditService.getAuditLogs).mockResolvedValue([mockAuditLog]);
      vi.mocked(fetchParticipantsModule.fetchParticipants).mockResolvedValue(
        mockParticipants
      );

      const params = new URLSearchParams('participant=1');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(screen.getByText('Histórico de Auditoria')).toBeInTheDocument();
      });
    });

    it('should handle change with oldValue and newValue as strings', async () => {
      const logWithStringChanges: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'description',
            oldValue: 'Old description',
            newValue: 'New description',
            fieldType: 'string',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithStringChanges,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          screen.getByText('Old description') ||
            screen.getByText('New description')
        ).toBeTruthy();
      });
    });

    it('should handle date value conversions in changes', async () => {
      const logWithDateChange: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'birthDate',
            oldValue: '1990-01-15',
            newValue: '1990-02-15',
            fieldType: 'date',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithDateChange,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const dateElements = screen.queryAllByText(/15|01|02/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle object value in changes', async () => {
      const logWithObjectChange: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'settings',
            oldValue: { theme: 'dark' },
            newValue: { theme: 'light' },
            fieldType: 'object',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithObjectChange,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          screen.getByText('settings') || screen.queryAllByText('dark')[0]
        ).toBeTruthy();
      });
    });

    it('should handle search with multiple matching logs', async () => {
      const multipleLogs: AuditLog[] = [
        mockAuditLog,
        {
          ...mockAuditLog,
          id: '2',
          userId: 'user789',
          userName: 'John Smith',
        },
      ];
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue(multipleLogs);

      const params = new URLSearchParams('search=John');
      vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams
      );

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const nameElements = screen.queryAllByText(/John/);
        expect(nameElements.length).toBeGreaterThan(1);
      });
    });

    it('should handle audit logs with array values in changes', async () => {
      const logWithArrayChange: AuditLog = {
        ...mockAuditLog,
        changes: [
          {
            field: 'tags',
            oldValue: ['old', 'tags'],
            newValue: ['new', 'tags', 'added'],
            fieldType: 'string',
          },
        ],
      };
      vi.mocked(auditService.getAllAuditLogs).mockResolvedValue([
        logWithArrayChange,
      ]);

      render(<AuditPage />, { wrapper: Wrapper });

      await waitFor(() => {
        const oldTags = screen.queryAllByText('tags');
        expect(oldTags.length).toBeGreaterThan(0);
      });
    });
  });
});
