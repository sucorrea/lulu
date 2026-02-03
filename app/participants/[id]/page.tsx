import type { Metadata } from 'next';

import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';
import { decryptId } from '@/lib/crypto';
import { getParticipantById } from '@/services/participants-server';

interface PageParams {
  id: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
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
}

async function Page({ params }: PageProps) {
  const paramsObject = await params;
  const { id } = paramsObject;

  if (!id) {
    return (
      <main className="flex w-full justify-center pt-10 text-sm text-destructive">
        Erro: ID do participante não encontrado
      </main>
    );
  }

  let idDecrypted: string | null = null;

  try {
    idDecrypted = decryptId(id);
  } catch {
    idDecrypted = null;
  }

  if (!idDecrypted) {
    return (
      <main className="flex w-full justify-center pt-10 text-sm text-destructive">
        Erro: ID do participante inválido
      </main>
    );
  }

  return <LulusCardEdit participantId={idDecrypted} />;
}

export default Page;
