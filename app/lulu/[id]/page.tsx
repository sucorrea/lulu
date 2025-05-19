import UpdateParticipantPhoto from '@/components/upload-file-form';
import { fetchParticipantById } from '@/services/queries/fetchParticipants';

const Page = async ({ params }: { params: { id: string } }) => {
  //const { id } = React.use(params);
  const { id } = params;

  const participant = await fetchParticipantById(id);

  if (!id) {
    return <div>Erro: ID do participante não encontrado</div>;
  }
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <UpdateParticipantPhoto participantId={id} participant={participant} />
      </div>
    </div>
  );
};

export default Page;
