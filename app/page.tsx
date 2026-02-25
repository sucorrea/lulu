import { headers } from 'next/headers';
import { Suspense } from 'react';
import { preload } from 'react-dom';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import ErrorState from '@/components/error-state';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';
import Lulus from '@/components/lulus/lulus-interactive';
import SkeletonLulusInteractive from '@/components/lulus/skeleton-lulus-interactive';
import {
  getNextBirthday,
  getParticipantPhotoUrl,
} from '@/components/lulus/utils';

const LulusDataFetcher = async () => {
  await headers();

  let participants;

  try {
    participants = await getParticipantsWithEditTokens();
  } catch {
    return (
      <ErrorState
        title="Erro ao carregar participantes"
        message="Não foi possível carregar os dados. Verifique sua conexão e tente novamente."
      />
    );
  }

  const nextBirthday = getNextBirthday(participants);
  const lcpPhotoUrl = nextBirthday
    ? getParticipantPhotoUrl(nextBirthday)
    : null;
  if (lcpPhotoUrl) {
    preload(lcpPhotoUrl, { as: 'image', fetchPriority: 'high' });
  }
  return <Lulus initialParticipants={participants} />;
};

const Home = () => (
  <PageLayout>
    <Header
      title="Participantes"
      description="Veja quem faz parte dessa rede de carinho e amizade"
    />
    <Suspense fallback={<SkeletonLulusInteractive />}>
      <LulusDataFetcher />
    </Suspense>
  </PageLayout>
);

export default Home;
