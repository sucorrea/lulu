'use client';
import { ChangeEvent, useCallback } from 'react';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
import { GenericDialog } from '../dialog/dialog';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import { toast } from 'sonner';

const UploadPhotoGallery = () => {
  const { user } = useUserVerification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useGetGalleryImages();

  const handlePhotoUploadGallery = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) {
        return;
      }
      (async () => {
        try {
          const photoId = `${user.uid}_${Date.now()}`;
          const { ref, uploadBytes } = await import('firebase/storage');
          const { storage } = await import('@/services/firebase');
          const storageRef = ref(storage, `gallery/${photoId}`);
          await uploadBytes(storageRef, file);
          onClose();
          refetch();
        } catch {
          toast.error('Erro ao enviar foto.', {
            position: 'bottom-center',
          });
        }
      })();
    },
    [user, onClose, refetch]
  );

  return (
    <>
      {user && (
        <div className="mb-4 flex justify-start">
          <Button onClick={() => onOpen()} className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-semibold">Enviar foto</span>
          </Button>
        </div>
      )}
      <GenericDialog
        className=" rounded"
        open={isOpen}
        onOpenChange={(open) => (open ? onOpen() : onClose())}
        title="Enviar Foto"
        description="Envie uma foto para a galeria"
        footer={
          <Button onClick={() => onClose()} className="ml-2">
            Cancelar
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUploadGallery}
            className="block"
          />
        </div>
      </GenericDialog>
    </>
  );
};

export default UploadPhotoGallery;
