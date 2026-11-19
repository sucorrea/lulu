'use client';
import { toast } from 'sonner';

import { Person } from './lulus/types';

interface PixInfoProps {
  participant: Person;
}

const PixInfo = ({ participant }: PixInfoProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(participant.pix_key ?? '');
      toast.success('Chave PIX copiada com sucesso!');
    } catch {
      toast.error('Não foi possível copiar a chave PIX');
    }
  };

  return (
    <button
      type="button"
      className="flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={handleCopy}
      aria-label="Copiar chave PIX"
    >
      Copiar PIX
    </button>
  );
};

export default PixInfo;
