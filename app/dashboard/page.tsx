'use client';

import dynamic from 'next/dynamic';
import BounceLoader from 'react-spinners/BounceLoader';

import { useUserVerification } from '@/hooks/user-verify';
import { useGetAllParticipants } from '@/services/queries/fetchParticipants';
import ErrorState from '@/components/error-state';

const DashboardPage = dynamic(() => import('@/components/modules/dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <BounceLoader color="#FF0000" />
    </div>
  ),
});

const Dashboard = () => {
  const { isLoading } = useUserVerification();

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    isError,
    refetch,
  } = useGetAllParticipants();

  if (isLoading || isLoadingParticipants) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pb-20">
        <BounceLoader color="#FF0000" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar os dados dos participantes. Verifique sua conexão e tente novamente."
        onRetry={() => refetch()}
      />
    );
  }

  return <DashboardPage participants={participants ?? []} />;
};

export default Dashboard;
