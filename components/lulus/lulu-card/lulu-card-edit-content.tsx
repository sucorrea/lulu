'use client';

import BounceLoader from 'react-spinners/BounceLoader';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import EditPhoto from '../edit-photo';
import PersonForm from '../form-edit-data/person-form';
import { GiftProfileForm } from '../form-edit-data/gift-profile-form';
import { NotificationOptIn } from '@/components/modules/notifications/notification-opt-in';

interface LulusCardEditContentProps {
  participantId: string;
}

const LulusCardEditContent = ({ participantId }: LulusCardEditContentProps) => {
  const {
    isAdmin,
    participantId: currentUserParticipantId,
  } = useUserVerification();
  const { data: participant, isLoading } = useGetParticipantById(participantId);
  const isOwner = currentUserParticipantId === participantId;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="var(--primary)" />
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
                {isAdmin && (
                  <>
                    <EditPhoto participant={participant} />
                    <PersonForm initialData={participant} mode="admin" />
                  </>
                )}
                {!isAdmin && isOwner && (
                  <PersonForm initialData={participant} mode="self-edit" />
                )}
                {(isAdmin || isOwner) && (
                  <>
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Informações para Presentes
                      </h3>
                      <GiftProfileForm
                        participantId={participantId}
                        initialData={participant}
                        mode={isAdmin ? 'admin' : 'self-edit'}
                      />
                    </div>
                    {isOwner && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Notificações
                        </h3>
                        <NotificationOptIn />
                      </div>
                    )}
                  </>
                )}
                {!isAdmin && !isOwner && (
                  <p className="text-muted-foreground text-center mt-4">
                    Você não tem permissão para editar este perfil.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LulusCardEditContent;
