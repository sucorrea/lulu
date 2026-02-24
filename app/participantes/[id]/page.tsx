import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { decryptId } from '@/lib/crypto';
import { getParticipantById } from '@/services/participants-server';

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const paramsObject = await props.params;
  const { id } = paramsObject;

  if (!id) {
    return {
      title: 'Editar participante',
      description: 'Página para editar os dados do participante',
    };
  }

  let decryptedId: string | null = null;

  try {
    decryptedId = decryptId(id);
  } catch {
    decryptedId = null;
  }

  if (!decryptedId) {
    return {
      title: 'Editar participante',
      description: 'Página para editar os dados do participante',
    };
  }

  const participant = await getParticipantById(decryptedId);

  return {
    title: participant ? participant.name : 'Editar participante',
    description: 'Página para editar os dados do participante',
  };
};

const ParticipantsPage = async ({ params }: Readonly<PageProps>) => {
  const paramsObject = await params;
  const { id } = paramsObject;

  if (!id) {
    notFound();
  }

  let idDecrypted: string | null = null;

  try {
    idDecrypted = decryptId(id);
  } catch {
    idDecrypted = null;
  }

  if (!idDecrypted) {
    notFound();
  }

  return <LulusCardEdit participantId={idDecrypted!} />;
};

export default ParticipantsPage;
