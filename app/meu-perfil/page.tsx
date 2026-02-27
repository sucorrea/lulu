'use client';

import { redirect } from 'next/navigation';

import { useUserVerification } from '@/hooks/user-verify';
import { useAutoLinkAccount } from '@/hooks/use-auto-link-account';
import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import PersonForm from '@/components/lulus/form-edit-data/person-form';
import { GiftProfileForm } from '@/components/lulus/form-edit-data/gift-profile-form';
import { NotificationOptIn } from '@/components/modules/notifications/notification-opt-in';

const MeuPerfilPage = () => {
  const { user, isLoading, isLulu, isAdmin, participantId } =
    useUserVerification();
  useAutoLinkAccount(user);

  const { data: participant, isLoading: isLoadingParticipant } =
    useGetParticipantById(participantId ?? '');

  if (isLoading || isLoadingParticipant) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Carregando seu perfil...</p>
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  if (!isLulu && !isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold font-comic mb-4">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Seu perfil ainda não foi associado. Peça para uma administradora
          vincular seu e-mail.
        </p>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold font-comic mb-4">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Participante não encontrado. Entre em contato com uma administradora.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold font-comic">Meu Perfil</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
        <PersonForm initialData={participant} mode="self-edit" />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Informações para Presentes
        </h2>
        <GiftProfileForm
          participantId={String(participant.id)}
          initialData={participant}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Notificações</h2>
        <NotificationOptIn />
      </section>
    </div>
  );
};

export default MeuPerfilPage;
