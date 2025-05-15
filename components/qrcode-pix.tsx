import { useEffect, useState } from 'react';
import { QrCodePix } from 'qrcode-pix';
import { QRCodeCanvas } from 'qrcode.react';
import { Person } from './lulus/types';
interface PixQRCodeProps {
  participant: Person;
}
export default function PixQRCode({ participant }: PixQRCodeProps) {
  const [payload, setPayload] = useState('');

  useEffect(() => {
    const qrCodePix = QrCodePix({
      version: '01',
      key: participant.pix_key ?? '',
      name: participant.fullName,
      city: 'OURINHOS',
      transactionId: participant.id.toString(),
    });
    setPayload(qrCodePix.payload());
  }, []);

  return (
    <div>
      {payload && (
        <>
          <QRCodeCanvas value={payload} size={100} />
          {/* <p style={{ wordBreak: 'break-all' }}>{payload}</p> */}
        </>
      )}
    </div>
  );
}
