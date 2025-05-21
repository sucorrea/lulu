import React from 'react';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { fetchParticipantById } from '@/services/queries/fetchParticipants';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata(props: PageProps) {
  const resolvedParams = await Promise.resolve(props.params);
  const { id } = resolvedParams;
  const participant = await fetchParticipantById(id);

  return {
    title: participant ? participant?.name : 'Editar participante',
    description: 'Página para editar os dados do participante',
  };
}

async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  if (!id) {
    return <div>Erro: ID do participante não encontrado</div>;
  }

  return <LulusCardEdit participantId={id} />;
}

export default Page;
