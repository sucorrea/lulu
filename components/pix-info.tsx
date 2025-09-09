'use client';
import Image from 'next/image';

import { useIsMobile } from '@/providers/device-provider';
import { Person } from './lulus/types';
import { NameKey } from './lulus/utils';

interface PixInfoProps {
  participant: Person;
}

const PixInfo = ({ participant }: PixInfoProps) => {
  const { isMobile } = useIsMobile();

  return (
    <div className="flex text-xs">
      <div className="flex gap-2">
        <Image
          src="/pix.svg"
          alt="Pix"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        {NameKey[participant.pix_key_type ?? 'none']}
      </div>
      <span
        className="ml-1 text-xs"
        onClick={() => {
          navigator.clipboard.writeText(participant.pix_key ?? '');
          if (!isMobile) {
            alert('QRCode copiado com sucesso!');
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {`: ${participant.pix_key}`}
      </span>
    </div>
  );
};

export default PixInfo;
