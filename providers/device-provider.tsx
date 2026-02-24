'use client';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';

const MOBILE_MAX_WIDTH = 1199;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_MAX_WIDTH}px)`;

export interface DeviceState {
  isMobile: boolean;
}

const HeaderContext = createContext<DeviceState | undefined>(undefined);

export const DeviceProvider = ({ children }: PropsWithChildren) => {
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(MOBILE_MEDIA_QUERY);
    const updateState = () => setIsMobileState(mediaQuery.matches);

    updateState();
    mediaQuery.addEventListener('change', updateState);

    return () => mediaQuery.removeEventListener('change', updateState);
  }, []);

  const contextValue = useMemo(
    () => ({
      isMobile: isMobileState,
    }),
    [isMobileState]
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useIsMobile = () => {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeader deve ser usado dentro de um DeviceProvider');
  }
  return context;
};
