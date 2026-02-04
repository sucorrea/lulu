'use client';
import { memo, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GaleriaComment } from '@/services/galeriaComments';
import { useCommentContext } from './comment-context';
import EditDeleteButtom from './edit-delete-buttom';

interface CommentItemProps {
  comment: GaleriaComment;
  isAuthor: boolean;
}

const CommentItem = memo(function CommentItem({
  comment,
  isAuthor,
}: CommentItemProps) {
  const {
    editingCommentId,
    editInput,
    onEditInputChange,
    onEditComment,
    onDeleteComment,
    onSaveEdit,
    onCancelEdit,
  } = useCommentContext();

  const editInputId = useId();
  const isEditing = editingCommentId === comment.id;

  return (
    <div className="text-sm text-gray-700 border-b py-1 flex items-center justify-between gap-2">
      <div className="flex-1">
        <span className="font-semibold mr-1">{comment.displayName}:</span>
        {isEditing ? (
          <fieldset className="contents border-0 p-0 m-0">
            <legend className="sr-only">Editar comentário</legend>
            <label htmlFor={editInputId} className="sr-only">
              Editar comentário
            </label>
            <Input
              id={editInputId}
              value={editInput}
              onChange={(e) => onEditInputChange(e.target.value)}
              className="px-1 py-0.5 text-sm"
              aria-describedby={`${editInputId}-hint`}
            />
            <span id={`${editInputId}-hint`} className="sr-only">
              Edite o texto do comentário e clique em Salvar
            </span>
            <Button size="sm" className="ml-1 px-2 py-0.5" onClick={onSaveEdit}>
              Salvar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-1 px-2 py-0.5"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          </fieldset>
        ) : (
          <span>{comment.comment}</span>
        )}
      </div>
      {isAuthor && !isEditing && (
        <EditDeleteButtom
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          comentSelected={comment}
        />
      )}
    </div>
  );
});

export default CommentItem;
