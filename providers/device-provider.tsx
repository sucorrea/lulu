'use client';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';

import { debounce } from 'lodash';
import { isMobile } from 'react-device-detect';

const MOBILE_MAX_WIDTH = 1199;

export interface DeviceState {
  isMobile: boolean;
}

const HeaderContext = createContext<DeviceState | undefined>(undefined);

export const DeviceProvider = ({ children }: PropsWithChildren) => {
  const [isMobileState, setIsMobileState] = useState<boolean>(isMobile);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobileState(window.innerWidth <= MOBILE_MAX_WIDTH);
    }, 150);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
