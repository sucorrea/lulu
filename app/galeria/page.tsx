import type { Metadata } from 'next';

import GaleriaFotos from '@/components/galeria/galeria-fotos-dynamic';

export const metadata: Metadata = {
  title: 'Galeria | Luluzinha',
  description:
    'Galeria de fotos da vaquinha. Compartilhe momentos, curta e comente as fotos.',
};

const GaleriaPage = () => <GaleriaFotos />;

export default GaleriaPage;
