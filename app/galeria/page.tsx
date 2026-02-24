import type { Metadata } from 'next';
import { Suspense } from 'react';

import GaleriaFotos from '@/components/galeria/galeria-fotos';

export const metadata: Metadata = {
  title: 'Galeria | Luluzinha',
  description:
    'Galeria de fotos da vaquinha. Compartilhe momentos, curta e comente as fotos.',
};

const GaleriaPage = () => {
  return (
    <Suspense
      fallback={<div className="p-4 text-center">Carregando galeria...</div>}
    >
      <GaleriaFotos />
    </Suspense>
  );
};

export default GaleriaPage;
