import React from 'react';
import LulusCardEdit from '@/components/lulus/lulu-card/lulu-card-edit';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export async function generateMetadata(props: PageProps) {
  // Await the params object to ensure it's resolved
  const resolvedParams = await Promise.resolve(props.params);
  const { id } = resolvedParams;
  return {
    title: `Editar Participante ${id}`,
    description: 'Página para editar os dados do participante',
  };
}

async function Page({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  if (!id) {
    return <div>Erro: ID do participante não encontrado</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <LulusCardEdit participantId={id} />
      </div>
    </div>
  );
}

export default Page;
