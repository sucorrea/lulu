import Link from 'next/link';

const OfflinePage = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold text-foreground">
        Você está offline
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Não foi possível carregar esta página. Verifique sua conexão com a
        internet e tente novamente.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Tentar novamente
      </Link>
    </section>
  );
};
export default OfflinePage;
