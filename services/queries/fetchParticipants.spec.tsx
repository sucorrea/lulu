import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchParticipants,
  useGetAllParticipants,
  fetchParticipantById,
  useGetParticipantById,
  fetchGalleryImages,
  useGetGalleryImages,
} from './fetchParticipants';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

vi.mock('../firebase', () => ({
  db: {},
  storage: {},
}));

const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockRef = vi.fn();
const mockGetDownloadURL = vi.fn();
const mockListAll = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (db: unknown, path: string) => mockCollection(db, path),
  getDocs: (ref: unknown) => mockGetDocs(ref),
  doc: (db: unknown, path: string, id: string) => mockDoc(db, path, id),
  getDoc: (ref: unknown) => mockGetDoc(ref),
}));

vi.mock('firebase/storage', () => ({
  ref: (storage: unknown, path: string) => mockRef(storage, path),
  getDownloadURL: (ref: unknown) => mockGetDownloadURL(ref),
  listAll: (ref: unknown) => mockListAll(ref),
}));

function createWrapper(options?: { retry?: number | false }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: options?.retry ?? false,
      },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

describe('fetchParticipants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchParticipants', () => {
    it('should fetch all participants successfully', async () => {
      const mockData = [
        { id: 1, name: 'John Doe', fullName: 'John Doe' },
        { id: 2, name: 'Jane Smith', fullName: 'Jane Smith' },
      ];

      const mockDocs = mockData.map((data) => ({
        data: () => data,
      }));

      mockGetDocs.mockResolvedValue({
        forEach: (callback: (doc: { data: () => unknown }) => void) => {
          mockDocs.forEach(callback);
        },
      });

      const result = await fetchParticipants();

      expect(result).toEqual(mockData);
      expect(mockCollection).toHaveBeenCalledWith({}, 'participants');
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no participants exist', async () => {
      mockGetDocs.mockResolvedValue({
        forEach: (_: (doc: { data: () => unknown }) => void) => {
          // Empty snapshot: forEach runs but callback is never called
        },
      });

      const result = await fetchParticipants();

      expect(result).toEqual([]);
      expect(mockGetDocs).toHaveBeenCalledTimes(1);
    });
  });

  describe('useGetAllParticipants', () => {
    it('should return query with participants data', async () => {
      const mockData = [{ id: 1, name: 'John Doe', fullName: 'John Doe' }];

      const mockDocs = mockData.map((data) => ({
        data: () => data,
      }));

      mockGetDocs.mockResolvedValue({
        forEach: (callback: (doc: { data: () => unknown }) => void) => {
          mockDocs.forEach(callback);
        },
      });

      const { result } = renderHook(() => useGetAllParticipants(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should handle loading state', () => {
      mockGetDocs.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useGetAllParticipants(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', async () => {
      const errorMessage = 'Failed to fetch';
      mockGetDocs.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useGetAllParticipants(), {
        wrapper: createWrapper({ retry: 2 }),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('fetchParticipantById', () => {
    it('should fetch participant by id successfully', async () => {
      const mockData = {
        id: 1,
        name: 'John Doe',
        fullName: 'John Doe',
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      });

      const result = await fetchParticipantById('1');

      expect(result).toEqual(mockData);
      expect(mockDoc).toHaveBeenCalledWith({}, 'participants', '1');
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
    });

    it('should return null when participant does not exist', async () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const result = await fetchParticipantById('999');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No participant found with id: 999'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle error and return null', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Firestore error');

      mockGetDoc.mockRejectedValue(error);

      const result = await fetchParticipantById('1');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching participant:',
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('useGetParticipantById', () => {
    it('should return query with participant data', async () => {
      const mockData = {
        id: 1,
        name: 'John Doe',
        fullName: 'John Doe',
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      });

      const { result } = renderHook(() => useGetParticipantById('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should return null when participant not found', async () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      const { result } = renderHook(() => useGetParticipantById('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it('should handle loading state', () => {
      mockGetDoc.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useGetParticipantById('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('fetchGalleryImages', () => {
    it('should fetch gallery images successfully', async () => {
      const mockUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ];

      const mockItems = [{ name: 'image1.jpg' }, { name: 'image2.jpg' }];

      mockListAll.mockResolvedValue({
        items: mockItems,
      });

      mockGetDownloadURL
        .mockResolvedValueOnce(mockUrls[0])
        .mockResolvedValueOnce(mockUrls[1]);

      const result = await fetchGalleryImages();

      expect(result).toEqual(mockUrls);
      expect(mockRef).toHaveBeenCalledWith({}, 'gallery');
      expect(mockListAll).toHaveBeenCalledTimes(1);
      expect(mockGetDownloadURL).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no images exist', async () => {
      mockListAll.mockResolvedValue({
        items: [],
      });

      const result = await fetchGalleryImages();

      expect(result).toEqual([]);
      expect(mockListAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useGetGalleryImages', () => {
    it('should return query with gallery images', async () => {
      const mockUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ];

      const mockItems = [{ name: 'image1.jpg' }, { name: 'image2.jpg' }];

      mockListAll.mockResolvedValue({
        items: mockItems,
      });

      mockGetDownloadURL
        .mockResolvedValueOnce(mockUrls[0])
        .mockResolvedValueOnce(mockUrls[1]);

      const consoleLogSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useGetGalleryImages(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUrls);

      consoleLogSpy.mockRestore();
    });

    it('should handle loading state', () => {
      mockListAll.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useGetGalleryImages(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', async () => {
      const errorMessage = 'Failed to fetch images';
      mockListAll.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useGetGalleryImages(), {
        wrapper: createWrapper({ retry: 2 }),
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should retry on failure', async () => {
      const mockUrls = ['https://example.com/image1.jpg'];
      const mockItems = [{ name: 'image1.jpg' }];

      mockListAll
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockRejectedValueOnce(new Error('Second attempt failed'))
        .mockResolvedValueOnce({ items: mockItems });

      mockGetDownloadURL.mockResolvedValue(mockUrls[0]);

      const { result } = renderHook(() => useGetGalleryImages(), {
        wrapper: createWrapper({ retry: 2 }),
      });

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.data).toEqual(mockUrls);
      expect(mockListAll).toHaveBeenCalledTimes(3);
    });
  });
});
