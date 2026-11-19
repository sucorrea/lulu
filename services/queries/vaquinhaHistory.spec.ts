import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useGetAllVaquinhaHistory,
  useGetVaquinhaHistoryByYear,
  useGetAvailableYears,
  useAddVaquinhaHistory,
  useUpdateVaquinhaHistory,
  useDeleteVaquinhaHistory,
} from './vaquinhaHistory';
import { VaquinhaHistoryInput } from '../vaquinhaHistory';

const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();
const mockUseQueryClient = vi.fn();

const mockServices = vi.hoisted(() => ({
  fetchAllVaquinhaHistory: vi.fn(),
  fetchVaquinhaHistoryById: vi.fn(),
  fetchVaquinhaHistoryByYear: vi.fn(),
  fetchVaquinhaHistoryByResponsible: vi.fn(),
  fetchVaquinhaHistoryByBirthdayPerson: vi.fn(),
  fetchAvailableYears: vi.fn(),
  addVaquinhaHistory: vi.fn(),
  updateVaquinhaHistory: vi.fn(),
  deleteVaquinhaHistory: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (args: unknown) => mockUseQuery(args),
  useMutation: (args: unknown) => mockUseMutation(args),
  useQueryClient: () => mockUseQueryClient(),
}));

vi.mock('../vaquinhaHistory', () => mockServices);

describe('vaquinhaHistory query hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryClient.mockReturnValue({ invalidateQueries: vi.fn() });
  });

  it('useGetAllVaquinhaHistory should configure query', () => {
    useGetAllVaquinhaHistory();

    const options = mockUseQuery.mock.calls.at(-1)?.[0] as {
      queryKey: string[];
      queryFn: () => void;
      retry: number;
    };

    expect(options.queryKey).toEqual(['vaquinha-history']);
    expect(options.queryFn).toBe(mockServices.fetchAllVaquinhaHistory);
    expect(options.retry).toBe(2);
  });

  it('useGetVaquinhaHistoryByYear should disable when year is null', () => {
    useGetVaquinhaHistoryByYear(null);

    const options = mockUseQuery.mock.calls.at(-1)?.[0] as { enabled: boolean };
    expect(options.enabled).toBe(false);
  });

  it('useGetVaquinhaHistoryByYear should call fetch by year', () => {
    useGetVaquinhaHistoryByYear(2024);

    const options = mockUseQuery.mock.calls.at(-1)?.[0] as {
      queryKey: (string | number | null)[];
      queryFn: () => void;
      enabled: boolean;
    };

    expect(options.queryKey).toEqual(['vaquinha-history', 'year', 2024]);
    expect(options.enabled).toBe(true);

    options.queryFn();
    expect(mockServices.fetchVaquinhaHistoryByYear).toHaveBeenCalledWith(2024);
  });

  it('useGetAvailableYears should configure query', () => {
    useGetAvailableYears();

    const options = mockUseQuery.mock.calls.at(-1)?.[0] as {
      queryKey: string[];
      queryFn: () => void;
      retry: number;
    };

    expect(options.queryKey).toEqual(['vaquinha-history', 'years']);
    expect(options.queryFn).toBe(mockServices.fetchAvailableYears);
    expect(options.retry).toBe(2);
  });

  it('useAddVaquinhaHistory should call mutation and invalidate cache', async () => {
    const invalidateQueries = vi.fn();
    mockUseQueryClient.mockReturnValue({ invalidateQueries });

    mockServices.addVaquinhaHistory.mockResolvedValue('new-id');

    useAddVaquinhaHistory();

    const options = mockUseMutation.mock.calls.at(-1)?.[0] as {
      mutationFn: (data: VaquinhaHistoryInput) => Promise<string>;
      onSuccess: () => void;
    };

    await options.mutationFn({} as VaquinhaHistoryInput);

    expect(mockServices.addVaquinhaHistory).toHaveBeenCalled();

    options.onSuccess();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['vaquinha-history'],
    });
  });

  it('useUpdateVaquinhaHistory should call mutation and invalidate cache', async () => {
    const invalidateQueries = vi.fn();
    mockUseQueryClient.mockReturnValue({ invalidateQueries });

    useUpdateVaquinhaHistory();

    const options = mockUseMutation.mock.calls.at(-1)?.[0] as {
      mutationFn: (data: {
        id: string;
        data: Partial<VaquinhaHistoryInput>;
      }) => Promise<void>;
      onSuccess: () => void;
    };

    await options.mutationFn({ id: '1', data: { year: 2024 } });

    expect(mockServices.updateVaquinhaHistory).toHaveBeenCalledWith('1', {
      year: 2024,
    });

    options.onSuccess();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['vaquinha-history'],
    });
  });

  it('useDeleteVaquinhaHistory should call mutation and invalidate cache', async () => {
    const invalidateQueries = vi.fn();
    mockUseQueryClient.mockReturnValue({ invalidateQueries });

    useDeleteVaquinhaHistory();

    const options = mockUseMutation.mock.calls.at(-1)?.[0] as {
      mutationFn: (id: string) => Promise<void>;
      onSuccess: () => void;
    };

    await options.mutationFn('1');

    expect(mockServices.deleteVaquinhaHistory).toHaveBeenCalledWith('1');

    options.onSuccess();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['vaquinha-history'],
    });
  });
});
