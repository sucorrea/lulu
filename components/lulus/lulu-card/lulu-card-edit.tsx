'use client';

import BounceLoader from 'react-spinners/BounceLoader';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import EditPhoto from '../edit-photo';
import PersonForm from '../form-edit-data/person-form';
import { Person } from '../types';

interface LulusCardEditProps {
  participantId: string;
}

const LulusCardEdit = ({ participantId }: LulusCardEditProps) => {
  const { data: participantData, isLoading } =
    useGetParticipantById(participantId);

  const participant = participantData ?? ({} as Person);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#F43F5E" />
      </div>
    );

  return (
    <Card className="m-4">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex flex-row items-center gap-3">
                <Avatar className="h-16 w-16 border-4 border-primary">
                  <AvatarImage
                    src={participant?.photoURL ?? ''}
                    alt={participant?.name}
                  />
                  <AvatarFallback>{participant?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="lulu-header text-3xl font-semibold text-primary ">
                  {participant?.name}
                </h2>
              </div>
              <EditPhoto participant={participant} />
              <PersonForm initialData={participantData ?? ({} as Person)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LulusCardEdit;
