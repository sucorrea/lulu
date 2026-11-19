import { useMemo } from 'react';

import { QrCodePix } from 'qrcode-pix';
import { QRCodeCanvas } from 'qrcode.react';

import { Person } from './lulus/types';
import { NameKey } from './lulus/pix-key-labels';

interface PixQRCodeProps {
  participant: Person;
}

const PixQRCode = ({ participant }: Readonly<PixQRCodeProps>) => {
  const payload = useMemo(
    () =>
      QrCodePix({
        version: '01',
        key: participant.pix_key ?? '',
        name: participant.fullName,
        city: participant.city,
        transactionId: participant.id.toString(),
      }).payload(),
    [participant]
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-xl border border-border bg-white p-1.5">
        <QRCodeCanvas
          value={payload}
          size={104}
          marginSize={0}
          aria-label={`QRCode Pix de ${participant.name}`}
        />
      </div>
      <p className="max-w-full break-all text-center text-xs text-muted-foreground">
        {`Chave PIX: ${NameKey[participant.pix_key_type ?? 'none']} · ${participant.pix_key}`}
      </p>
    </div>
  );
};

export default PixQRCode;
