'use client';

import Image from 'next/image';

import BounceLoader from 'react-spinners/BounceLoader';

import { useUserVerification } from '@/hooks/user-verify';
import { useGettAllParticipants } from '@/services/queries/fetchParticipants';
import DashboardPage from '@/components/lulus/dashoard';

const ano = new Date().getFullYear();

const Dashboard = () => {
  const { isLoading } = useUserVerification();
  const { isLoading: isLoadingParticipants } = useGettAllParticipants();

  if (isLoading || isLoadingParticipants)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#FF0000" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
      <div className=" mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/luluzinha_no_background.png"
            alt="luluzinha"
            width={50}
            height={50}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
          <h1 className="text-2xl font-bold text-center mb-8 text-primary animate-fade-in font-baloo">
            Luluzinha {ano}
          </h1>
        </div>
        <DashboardPage />
      </div>
    </div>
  );
};

export default Dashboard;
