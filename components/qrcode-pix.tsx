import { useCallback, useEffect, useState } from 'react';

import { QrCodePix } from 'qrcode-pix';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'sonner';

import { useDisclosure } from '@/hooks/use-disclosure';
import { useIsMobile } from '@/providers/device-provider';
import { GenericBottomSheet } from './dialog/bottom-sheet';
import { GenericDialog } from './dialog/dialog';
import { Person } from './lulus/types';
import { Button } from './ui/button';

interface PixQRCodeProps {
  participant: Person;
}

const qrContent = (payload: string) => (
  <div className="flex flex-col items-center justify-center gap-1">
    <QRCodeCanvas value={payload} size={100} />
    <Button
      variant="ghost"
      onClick={() => {
        navigator.clipboard.writeText(payload);
        toast.success('QRCode Pix copiado com sucesso!');
      }}
    >
      copiar QRCode Pix
    </Button>
  </div>
);

const PixQRCode = ({ participant }: Readonly<PixQRCodeProps>) => {
  const [payload, setPayload] = useState('');
  const { isOpen, onToggle } = useDisclosure();
  const { isMobile } = useIsMobile();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open !== isOpen) {
        onToggle();
      }
    },
    [isOpen, onToggle]
  );

  useEffect(() => {
    const qrCodePix = QrCodePix({
      version: '01',
      key: participant.pix_key ?? '',
      name: participant.fullName,
      city: participant.city,
      transactionId: participant.id.toString(),
    });
    setPayload(qrCodePix.payload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-end justify-end gap-1 min-h-[15px] ">
      <Button
        variant="link"
        onClick={(e) => {
          (e.currentTarget as HTMLButtonElement).blur();
          onToggle();
        }}
        className="no-underline"
      >
        {`Ver QRCode Pix de ${participant.name}`}
      </Button>
      {isMobile ? (
        <GenericBottomSheet
          open={isOpen && !!payload}
          onOpenChange={handleOpenChange}
          title={`QRCode Pix de ${participant.name}`}
          description="Copie o QRCode Pix"
        >
          {qrContent(payload)}
        </GenericBottomSheet>
      ) : (
        <GenericDialog
          className="w-[calc(100%-2rem)] max-w-[min(400px,95vw)] sm:max-w-[50%] rounded"
          open={isOpen && !!payload}
          onOpenChange={handleOpenChange}
          title={`QRCode Pix de ${participant.name}`}
          description="Copie o QRCode Pix"
        >
          {qrContent(payload)}
        </GenericDialog>
      )}
    </div>
  );
};

export default PixQRCode;
