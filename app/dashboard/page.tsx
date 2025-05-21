'use client';

import BounceLoader from 'react-spinners/BounceLoader';

import { useUserVerification } from '@/hooks/user-verify';
import { useGettAllParticipants } from '@/services/queries/fetchParticipants';
import DashboardPage from '@/components/lulus/dashoard';

const Dashboard = () => {
  const { isLoading } = useUserVerification();
  const { isLoading: isLoadingParticipants } = useGettAllParticipants();

  if (isLoading || isLoadingParticipants)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#FF0000" />
      </div>
    );

  return <DashboardPage />;
};

export default Dashboard;
