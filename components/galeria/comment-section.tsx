'use client';
import { memo, useId } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GaleriaComment } from '@/services/galeriaComments';
import CommentItem from './comment-item';
import { useCommentContext } from './comment-context';

interface CommentSectionProps {
  comments: GaleriaComment[];
  userId: string | null;
}

const CommentSection = memo(function CommentSection({
  comments,
  userId,
}: CommentSectionProps) {
  const {
    commentInput,
    editingCommentId,
    editInput,
    onCommentInputChange,
    onEditInputChange,
    onSubmitComment,
    onEditComment,
    onDeleteComment,
    onSaveEdit,
    onCancelEdit,
  } = useCommentContext();

  const commentInputId = useId();
  const isLoggedIn = userId !== null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && commentInput.trim()) {
      e.preventDefault();
      onSubmitComment();
    }
  };

  return (
    <section aria-label="Comentários">
      <div
        className="mb-2 max-h-24 overflow-y-auto"
        role="list"
        aria-label="Lista de comentários"
      >
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((commentItem) => {
            const isAuthor = commentItem.userId === userId;
            return (
              <CommentItem
                key={commentItem.id}
                comment={commentItem}
                isAuthor={isAuthor}
              />
            );
          })
        )}
      </div>
      <div className="flex gap-2">
        <label htmlFor={commentInputId} className="sr-only">
          {isLoggedIn ? 'Escreva um comentário' : 'Faça login para comentar'}
        </label>
        <Input
          id={commentInputId}
          type="text"
          value={commentInput}
          onChange={(e) => onCommentInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border rounded px-2 py-1 flex-1 text-sm"
          placeholder={
            isLoggedIn ? 'Comente algo...' : 'Faça login para comentar'
          }
          disabled={!isLoggedIn}
          aria-describedby={isLoggedIn ? undefined : `${commentInputId}-hint`}
        />
        {!isLoggedIn && (
          <span id={`${commentInputId}-hint`} className="sr-only">
            Você precisa fazer login para comentar
          </span>
        )}
        <Button
          onClick={onSubmitComment}
          disabled={!isLoggedIn || !commentInput.trim()}
          aria-label="Enviar comentário"
        >
          Enviar
        </Button>
      </div>
    </section>
  );
});

export default CommentSection;
