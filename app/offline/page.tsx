import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline | Luluzinha',
  description: 'Você está offline. Verifique sua conexão com a internet.',
};

const OfflinePage = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-serif text-3xl font-bold text-primary">
        Você está offline
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Não foi possível carregar esta página. Verifique sua conexão com a
        internet e tente novamente.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Tentar novamente
      </Link>
    </section>
  );
};
export default OfflinePage;
