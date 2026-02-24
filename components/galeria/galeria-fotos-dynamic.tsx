'use client';

import dynamic from 'next/dynamic';

const GaleriaFotosDynamic = dynamic(() => import('./galeria-fotos'), {
  ssr: false,
});

export default GaleriaFotosDynamic;
