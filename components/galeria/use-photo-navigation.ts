import { useCallback, useMemo, useState } from 'react';

export const usePhotoNavigation = (photos: string[]) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const total = photos.length;

  const selectedPhoto =
    selectedIndex === null ? null : (photos[selectedIndex] ?? null);

  const selectPhoto = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closePhoto = useCallback(() => setSelectedIndex(null), []);

  const nextPhoto = useCallback(
    () =>
      setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % total)),
    [total]
  );

  const prevPhoto = useCallback(
    () =>
      setSelectedIndex((prev) =>
        prev === null ? null : (prev - 1 + total) % total
      ),
    [total]
  );

  return useMemo(
    () => ({
      selectedIndex,
      selectedPhoto,
      selectPhoto,
      closePhoto,
      nextPhoto,
      prevPhoto,
    }),
    [
      selectedIndex,
      selectedPhoto,
      selectPhoto,
      closePhoto,
      nextPhoto,
      prevPhoto,
    ]
  );
};
