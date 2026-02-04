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
      <div className="flex gap-1">
        <Image
          src="/pix.svg"
          alt="Pix"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        {NameKey[participant.pix_key_type ?? 'none']}
      </div>
      <button
        type="button"
        className="text-xs bg-transparent border-0 p-0 cursor-pointer hover:underline"
        onClick={() => {
          navigator.clipboard.writeText(participant.pix_key ?? '');
          if (!isMobile) {
            alert('QRCode copiado com sucesso!');
          }
        }}
      >
        {`: ${participant.pix_key}`}
      </button>
    </div>
  );
};

export default PixInfo;
