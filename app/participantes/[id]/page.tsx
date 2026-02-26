import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { decryptId, encryptId } from '@/lib/crypto';
import {
  getParticipantById,
  getParticipants,
} from '@/services/participants-server';

const getCachedParticipantName = unstable_cache(
  async (id: string): Promise<string> => {
    const participant = await getParticipantById(id);
    return participant?.name ?? 'Editar participante';
  },
  ['participant-name'],
  { revalidate: 3600, tags: ['participants'] }
);

export const generateStaticParams = async () => {
  try {
    const participants = await getParticipants();
    return participants.map((p) => ({ id: encryptId(String(p.id)) }));
  } catch {
    return [];
  }
};

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

  const title = await getCachedParticipantName(decryptedId);

  return {
    title,
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

  return <LulusCardEdit participantId={idDecrypted} />;
};

export default ParticipantsPage;
