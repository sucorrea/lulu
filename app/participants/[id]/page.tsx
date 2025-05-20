'use client';
import LulusCardEdit from '@/components/lulus/lulu-card-edit';
import React from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  //eslint-disable-next-line
  // @ts-ignore
  const { id } = React.use(params);

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
};

export default Page;
