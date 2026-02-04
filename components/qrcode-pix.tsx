import { useEffect, useState } from 'react';

import { QrCodePix } from 'qrcode-pix';
import { QRCodeCanvas } from 'qrcode.react';

import { Person } from './lulus/types';
import { Button } from './ui/button';
import { useIsMobile } from '@/providers/device-provider';
import { useDisclosure } from '@/hooks/use-disclosure';

interface PixQRCodeProps {
  participant: Person;
}

export default function PixQRCode({ participant }: Readonly<PixQRCodeProps>) {
  const [payload, setPayload] = useState('');
  const { isOpen, onToggle } = useDisclosure();
  const { isMobile } = useIsMobile();

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
      <Button variant="link" onClick={onToggle} className="no-underline">
        {isOpen
          ? `fechar QRCode Pix de ${participant.name}`
          : `mostrar QRCode Pix de ${participant.name}`}
      </Button>
      {isOpen && payload && (
        <div className="flex flex-col items-center justify-center gap-1">
          <QRCodeCanvas
            value={payload}
            size={100}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(payload);
            }}
          />
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(payload);
              if (!isMobile) {
                alert('QRCode copiado com sucesso!');
              }
            }}
          >
            copiar QRCode Pix
          </Button>
        </div>
      )}
    </div>
  );
}
