import { useEffect, useState } from 'react';

import { QrCodePix } from 'qrcode-pix';
import { QRCodeCanvas } from 'qrcode.react';

import { Person } from './lulus/types';
import { Button } from './ui/button';
import { useIsMobile } from '@/providers/device-provider';

interface PixQRCodeProps {
  participant: Person;
}

export default function PixQRCode({ participant }: PixQRCodeProps) {
  const [payload, setPayload] = useState('');
  const [showQRCodePix, setshowQRCodePix] = useState(false);
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
  }, []);

  return (
    <>
      <div className="flex flex-col items-end justify-end gap-1 min-h-[15px] ">
        <Button
          variant="link"
          onClick={() => setshowQRCodePix((prev) => !prev)}
          className="no-underline"
        >
          {showQRCodePix
            ? 'fechar QRCode Pix'
            : `mostrar QRCode Pix ${participant.name}`}
        </Button>
        {showQRCodePix && payload && (
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
    </>
  );
}
