'use client';

import { Edit2, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GaleriaComment } from '@/services/galeriaComments';

type EditDeleteButtonProps = {
  onEdit: (comentSelected: GaleriaComment) => void;
  onDelete: (id: string) => void;
  comentSelected: GaleriaComment;
};

const EditDeleteButton = ({
  onEdit,
  onDelete,
  comentSelected,
}: EditDeleteButtonProps) => {
  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="px-2 py-0.5"
        onClick={() => {
          onEdit(comentSelected);
        }}
        aria-label="Editar comentário"
      >
        <Edit2 size={15} />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="px-2 py-0.5"
        onClick={() => {
          onDelete(comentSelected.id);
        }}
        aria-label="Excluir comentário"
      >
        <Trash2Icon size={15} className="text-red-500" />
      </Button>
    </div>
  );
};

export default EditDeleteButton;
