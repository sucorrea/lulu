'use client';
import { useCallback, useState } from 'react';

import { CameraIcon } from 'lucide-react';

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
  const { mutate, isPending } = useUploadPhoto(String(participant.id));
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = useCallback(() => {
    if (!file) {
      return;
    }

    mutate(
      { file, participantId: String(participant.id) },
      {
        onSuccess: () => {
          setFile(null);
          onClose();
        },
      }
    );
  }, [mutate, file, participant.id, onClose]);

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
        className="max-w-[80%] rounded"
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
          <Avatar className="h-22 w-22 border-2 border-primary">
            <AvatarImage
              src={
                file ? URL.createObjectURL(file) : (participant?.photoURL ?? '')
              }
              alt={file ? 'Nova foto' : participant?.name}
              width={64}
              height={64}
            />
            <AvatarFallback>{participant?.name.charAt(0)}</AvatarFallback>
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
