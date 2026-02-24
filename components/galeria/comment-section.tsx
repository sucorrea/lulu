'use client';
import { KeyboardEvent, memo, useId } from 'react';

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
  const { commentInput, onCommentInputChange, onSubmitComment } =
    useCommentContext();

  const commentInputId = useId();
  const isLoggedIn = userId !== null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && commentInput.trim()) {
      e.preventDefault();
      onSubmitComment();
    }
  };

  const hasComments = comments.length > 0;

  return (
    <section aria-label="Comentários">
      {hasComments ? (
        <ul
          className="mb-2 max-h-[6.5rem] overflow-y-auto list-none p-0 m-0"
          aria-label="Lista de comentários"
        >
          {comments.map((commentItem) => (
            <li key={commentItem.id}>
              <CommentItem
                comment={commentItem}
                isAuthor={commentItem.userId === userId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground py-2 mb-2">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      )}
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
