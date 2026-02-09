'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import type { GaleriaComment } from '@/services/galeriaComments';

interface CommentContextType {
  commentInput: string;
  editingCommentId: string | null;
  editInput: string;
  onCommentInputChange: (value: string) => void;
  onEditInputChange: (value: string) => void;
  onEditComment: (comment: GaleriaComment) => void;
  onDeleteComment: (commentId: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onSubmitComment: () => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

interface CommentProviderProps {
  children: ReactNode;
  onSubmitComment: (comment: string) => void;
  onEditComment: (commentId: string, newText: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentProvider = ({
  children,
  onSubmitComment: handleSubmitComment,
  onEditComment: handleEditComment,
  onDeleteComment: handleDeleteComment,
}: Readonly<CommentProviderProps>) => {
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const onCommentInputChange = useCallback((value: string) => {
    setCommentInput(value);
  }, []);

  const onEditInputChange = useCallback((value: string) => {
    setEditInput(value);
  }, []);

  const onEditComment = useCallback((comment: GaleriaComment) => {
    setEditingCommentId(comment.id);
    setEditInput(comment.comment);
  }, []);

  const onDeleteComment = useCallback(
    (commentId: string) => {
      handleDeleteComment(commentId);
    },
    [handleDeleteComment]
  );

  const onSaveEdit = useCallback(() => {
    if (editingCommentId && editInput.trim()) {
      handleEditComment(editingCommentId, editInput);
      setEditingCommentId(null);
      setEditInput('');
    }
  }, [editingCommentId, editInput, handleEditComment]);

  const onCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditInput('');
  }, []);

  const onSubmitComment = useCallback(() => {
    if (commentInput.trim()) {
      handleSubmitComment(commentInput);
      setCommentInput('');
    }
  }, [commentInput, handleSubmitComment]);

  const value: CommentContextType = useMemo(
    () => ({
      commentInput,
      editingCommentId,
      editInput,
      onCommentInputChange,
      onEditInputChange,
      onEditComment,
      onDeleteComment,
      onSaveEdit,
      onCancelEdit,
      onSubmitComment,
    }),
    [
      commentInput,
      editingCommentId,
      editInput,
      onCommentInputChange,
      onEditInputChange,
      onEditComment,
      onDeleteComment,
      onSaveEdit,
      onCancelEdit,
      onSubmitComment,
    ]
  );

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within CommentProvider');
  }
  return context;
};
