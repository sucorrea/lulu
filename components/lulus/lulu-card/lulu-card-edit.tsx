'use client';

import { useState, useEffect } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import EditPhoto from '../edit-photo';
import PersonForm from '../form-edit-data/person-form';

interface LulusCardEditProps {
  participantId: string;
}

const LulusCardEdit = ({ participantId }: LulusCardEditProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: participantData, isLoading } =
    useGetParticipantById(participantId);

  const participant = participantData;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#F43F5E" />
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground text-center">
          Participante não encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen overflow-y-auto p-4">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-2xl">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <div className="flex flex-row items-center gap-2 ml-4">
                  <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-primary">
                    <AvatarImage
                      src={participant.photoURL ?? ''}
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {(participant.name ?? '').charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="lulu-header text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
                    {participant.name}
                  </h2>
                </div>
                <EditPhoto participant={participant} />
                <PersonForm initialData={participant} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LulusCardEdit;
