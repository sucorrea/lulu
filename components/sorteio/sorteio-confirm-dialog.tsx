'use client';

import { AlertTriangle, Loader2, Save } from 'lucide-react';

import { GenericDialog } from '@/components/dialog/dialog';
import { Button } from '@/components/ui/button';

interface SorteioConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  selectedYear: number;
  pairCount: number;
  hasRelaxed: boolean;
  isPending: boolean;
}

export const SorteioConfirmDialog = ({
  open,
  onOpenChange,
  onClose,
  onConfirm,
  selectedYear,
  pairCount,
  hasRelaxed,
  isPending,
}: SorteioConfirmDialogProps) => (
  <GenericDialog
    open={open}
    onOpenChange={onOpenChange}
    title="Confirmar Sorteio"
    description={`Deseja salvar o sorteio de ${selectedYear}?`}
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar
        </Button>
      </>
    }
  >
    <p>
      Isso criará <strong>{pairCount}</strong> atribuições para a vaquinha de{' '}
      {selectedYear}.
    </p>
    {hasRelaxed && (
      <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Algumas atribuições podem repetir o ano anterior, pois não foi
          possível evitar todas as repetições.
        </p>
      </div>
    )}
  </GenericDialog>
);
