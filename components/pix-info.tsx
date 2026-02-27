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
  const nameKey = NameKey[participant.pix_key_type ?? 'none'];
  return (
    <div className="flex items-center gap-1 text-xs">
      <Image
        src="/pix.svg"
        alt="Pix"
        width={20}
        height={20}
        sizes="20px"
        className="h-5 w-5 shrink-0"
      />
      {nameKey && `${nameKey}: `}
      <button
        type="button"
        className="text-xs bg-transparent border-0 p-0 cursor-pointer hover:underline"
        onClick={handleCopy}
        aria-label="Copiar chave PIX"
      >
        {` ${participant.pix_key}`}
      </button>
    </div>
  );
};

export default PixInfo;
