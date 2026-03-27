'use client';
import { ChangeEvent, useCallback, useRef, useState } from 'react';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
import { GenericDialog } from '../dialog/dialog';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import { toast } from 'sonner';

const UploadPhotoGallery = () => {
  const { user, isAdmin } = useUserVerification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refetch } = useGetGalleryImages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setSelectedFileName(null);
    onClose();
  }, [onClose]);

  const handlePhotoUploadGallery = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) {
        return;
      }
      setSelectedFileName(file.name);
      (async () => {
        try {
          const photoId = `${user.uid}_${Date.now()}`;
          const { uploadGalleryPhoto } = await import(
            '@/services/queries/uploadGalleryPhoto'
          );
          await uploadGalleryPhoto({ file, photoId });
          handleClose();
          refetch();
        } catch {
          toast.error('Erro ao enviar foto.', {
            position: 'bottom-center',
          });
        }
      })();
    },
    [user, handleClose, refetch]
  );

  return (
    <>
      {isAdmin && (
        <div className="mb-4 flex justify-start">
          <Button onClick={() => onOpen()} className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-semibold">Enviar foto</span>
          </Button>
        </div>
      )}
      <GenericDialog
        className="w-[calc(100%-2rem)] min-w-0 max-w-[min(400px,95vw)] overflow-hidden rounded sm:max-w-[50%]"
        open={isOpen}
        onOpenChange={(open) => (open ? onOpen() : handleClose())}
        title="Enviar Foto"
        description="Envie uma foto para a galeria"
        footer={
          <Button onClick={() => handleClose()} className="w-full min-w-0">
            Cancelar
          </Button>
        }
      >
        <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-input bg-muted/50 p-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => inputRef.current?.click()}
          >
            Escolher arquivo
          </Button>
          <span className="min-w-0 truncate text-sm text-muted-foreground">
            {selectedFileName ?? 'Nenhum arquivo escolhido'}
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUploadGallery}
          className="sr-only"
          aria-label="Selecionar foto para enviar"
        />
      </GenericDialog>
    </>
  );
};

export default UploadPhotoGallery;
