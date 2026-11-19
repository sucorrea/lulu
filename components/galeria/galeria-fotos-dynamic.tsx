'use client';

import dynamic from 'next/dynamic';

import GaleriaSkeleton from './galeria-skeleton';

const GaleriaFotosDynamic = dynamic(() => import('./galeria-fotos'), {
  ssr: false,
  loading: () => <GaleriaSkeleton />,
});

export default GaleriaFotosDynamic;
