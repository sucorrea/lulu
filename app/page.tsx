import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import ErrorState from '@/components/error-state';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import {
  getNextBirthday,
  getParticipantPhotoUrl,
} from '@/components/lulus/utils';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';

const Lulus = dynamic(() => import('@/components/lulus/lulus-interactive'), {
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
      <PageLayout>
        <ErrorState
          title="Erro ao carregar participantes"
          message="Não foi possível carregar a lista de participantes. Por favor, recarregue a página."
        />
      </PageLayout>
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
    <PageLayout>
      <Header
        title="Participantes"
        description="Veja quem faz parte dessa rede de carinho e amizade"
      />
      <Lulus initialParticipants={participants} />
    </PageLayout>
  );
};

export default Home;
