import { Suspense } from 'react';

import GaleriaFotos from '@/components/galeria/galeria-fotos';

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
