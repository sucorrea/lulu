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
  canOptimizeImage,
  getNextBirthday,
  getParticipantPhotoUrl,
  getTodayKey,
  todayFromKey,
} from '@/components/lulus/utils';
import { HOME_TIME_ZONE } from '@/lib/constants';

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

  const todayKey = getTodayKey();
  const nextBirthday = getNextBirthday(participants, todayFromKey(todayKey));
  const lcpPhotoUrl = nextBirthday
    ? getParticipantPhotoUrl(nextBirthday)
    : null;
  if (lcpPhotoUrl && !canOptimizeImage(lcpPhotoUrl)) {
    preload(lcpPhotoUrl, { as: 'image', fetchPriority: 'high' });
  }
  return <Lulus initialParticipants={participants} todayKey={todayKey} />;
};

const getMonthEyebrow = (today: Date): string => {
  const month = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: HOME_TIME_ZONE,
  }).format(today);
  const year = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    timeZone: HOME_TIME_ZONE,
  }).format(today);
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} · ${year}`;
};

const Home = () => (
  <PageLayout>
    <Header
      eyebrow={getMonthEyebrow(new Date())}
      title="Nossa roda de amigas"
      description="Veja quem faz parte dessa rede de carinho e amizade"
    />
    <Suspense fallback={<SkeletonLulusInteractive />}>
      <LulusDataFetcher />
    </Suspense>
  </PageLayout>
);

export default Home;
