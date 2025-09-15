import React from 'react';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { fetchParticipantById } from '@/services/queries/fetchParticipants';
import { decryptId } from '@/lib/crypto';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps) {
  const paramsObject = await props.params;
  const { id } = paramsObject;

  const participant = await fetchParticipantById(id);

  return {
    title: participant ? participant?.name : 'Editar participante',
    description: 'Página para editar os dados do participante',
  };
}

async function Page({ params }: PageProps) {
  const paramsObject = await params;
  const { id } = paramsObject;
  if (!id) {
    return <div>Erro: ID do participante não encontrado</div>;
  }
  const idDecrypted = decryptId(paramsObject.id);
  return <LulusCardEdit participantId={idDecrypted} />;
}

export default Page;
