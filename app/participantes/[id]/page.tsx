import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { decryptId, encryptId } from '@/lib/crypto';
import {
  getParticipantById,
  getParticipants,
} from '@/services/participants-server';

const getCachedParticipantName = async (id: string): Promise<string> => {
  'use cache';
  cacheLife('hours');
  cacheTag('participants');
  const participant = await getParticipantById(id);
  return participant?.name ?? 'Editar participante';
};

export const generateStaticParams = async () => {
  const participants = await getParticipants();
  return participants.map((p) => ({ id: encryptId(String(p.id)) }));
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
