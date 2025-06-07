'use client';

import BounceLoader from 'react-spinners/BounceLoader';

import { useUserVerification } from '@/hooks/user-verify';
import { useGettAllParticipants } from '@/services/queries/fetchParticipants';
import DashboardPage from '@/components/modules/dashboard';

const Dashboard = () => {
  const { isLoading } = useUserVerification();
  const { data: participants, isLoading: isLoadingParticipants } =
    useGettAllParticipants();

  if (isLoading || isLoadingParticipants)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pb-20">
        <BounceLoader color="#FF0000" />
      </div>
    );

  return <DashboardPage participants={participants ?? []} />;
};

export default Dashboard;
