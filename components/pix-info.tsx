'use client';
import Image from 'next/image';
import { toast } from 'sonner';

import { useIsMobile } from '@/providers/device-provider';
import { Person } from './lulus/types';
import { NameKey } from './lulus/utils';

interface PixInfoProps {
  participant: Person;
}

const PixInfo = ({ participant }: PixInfoProps) => {
  const { isMobile } = useIsMobile();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(participant.pix_key ?? '');
      if (!isMobile) {
        toast.success('Chave PIX copiada com sucesso!');
      }
    } catch {
      if (!isMobile) {
        toast.error('Não foi possível copiar a chave PIX');
      }
    }
  };

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
        onClick={handleCopy}
        aria-label="Copiar chave PIX"
      >
        {`: ${participant.pix_key}`}
      </button>
    </div>
  );
};

export default PixInfo;
