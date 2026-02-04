'use client';
import { useCallback, useState } from 'react';

import { CameraIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';
import { GenericDialog } from '../dialog/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UpdateParticipantPhoto from '../upload-file-form';
import { Person } from './types';

interface LulusCardEditProps {
  participant: Person;
}

const EditPhoto = ({ participant }: LulusCardEditProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isPending, error } = useUploadPhoto(String(participant.id));
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = useCallback(() => {
    if (!file) {
      return;
    }

    mutate(
      { file, participantId: String(participant.id) },
      {
        onSuccess: () => {
          toast.success('Foto alterada com sucesso', {
            position: 'bottom-center',
          });
          setFile(null);
          onClose();
        },
        onError: () => toast.error(error?.message ?? 'Erro ao alterar foto'),
      }
    );
  }, [mutate, file, participant.id, onClose, error]);

  const handleConfirmar = useCallback(() => handleUpload(), [handleUpload]);

  return (
    <>
      <Button
        onClick={onOpen}
        variant="link"
        className="flex items-center gap-1 text-primary hover:no-underline"
      >
        <CameraIcon size="1rem" />
        Alterar foto
      </Button>
      <GenericDialog
        className="max-w-[50%] rounded"
        open={isOpen}
        onOpenChange={(open) => (open ? onOpen() : onClose())}
        title={participant.name}
        footer={
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmar}
              disabled={isPending || !file}
            >
              Confirmar
            </Button>
          </div>
        }
      >
        <div className="flex-col flex justify-center items-center">
          <Avatar className="h-32 w-32 border-4 border-primary">
            <AvatarImage
              src={
                file ? URL.createObjectURL(file) : (participant?.photoURL ?? '')
              }
              alt={file ? 'Nova foto' : participant?.name}
            />
            <AvatarFallback>
              {(participant?.name ?? '').charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>

          <UpdateParticipantPhoto
            participantId={String(participant.id)}
            setFile={setFile}
          />
        </div>
      </GenericDialog>
    </>
  );
};

export default EditPhoto;
