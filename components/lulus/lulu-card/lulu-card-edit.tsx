'use client';

import dynamic from 'next/dynamic';
import BounceLoader from 'react-spinners/BounceLoader';

const LulusCardEditDynamic = dynamic(() => import('./lulu-card-edit-content'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BounceLoader color="#F43F5E" />
    </div>
  ),
});

interface LulusCardEditProps {
  participantId: string;
}

const LulusCardEdit = ({ participantId }: LulusCardEditProps) => (
  <LulusCardEditDynamic participantId={participantId} />
);

export default LulusCardEdit;
