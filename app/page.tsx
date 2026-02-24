import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import ErrorState from '@/components/error-state';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import {
  getNextBirthday,
  getParticipantPhotoUrl,
} from '@/components/lulus/utils';

const Lulus = dynamic(() => import('@/components/lulus/lulus'), {
  ssr: true,
  loading: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});

const Home = async () => {
  let participants;
  let error = false;

  try {
    participants = await getParticipantsWithEditTokens();
  } catch (e) {
    console.error('Erro ao buscar participantes:', e);
    error = true;
  }

  if (error || !participants) {
    return (
      <section className="bg-muted/40 py-10 md:py-14">
        <div className="container">
          <ErrorState
            title="Erro ao carregar participantes"
            message="Não foi possível carregar a lista de participantes. Por favor, recarregue a página."
          />
        </div>
      </section>
    );
  }

  const nextBirthday = getNextBirthday(participants);
  const lcpPhotoUrl = nextBirthday
    ? getParticipantPhotoUrl(nextBirthday)
    : null;
  if (lcpPhotoUrl) {
    preload(lcpPhotoUrl, { as: 'image', fetchPriority: 'high' });
  }

  return (
    <section className="bg-muted/40 py-10 md:py-14">
      <div className="container space-y-6">
        <header className="space-y-2 text-center md:text-left">
          <h1 className="lulu-header text-2xl md:text-3xl">Participantes</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Veja quem faz parte dessa rede de carinho e amizade
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-card/80 p-2 md:p-4">
          <Lulus participants={participants} />
        </div>
      </div>
    </section>
  );
};

export default Home;
