import { preload } from 'react-dom';
import ErrorState from '@/components/error-state';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import {
  getNextBirthday,
  getParticipantPhotoUrl,
} from '@/components/lulus/utils';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';

import Lulus from '@/components/lulus/lulus-interactive';

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
