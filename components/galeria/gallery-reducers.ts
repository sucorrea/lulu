import type { GaleriaComment } from '@/services/galeriaComments';

export interface LikeState {
  likes: Record<string, string[]>;
}

export type LikeAction = {
  type: 'toggle';
  photo: string;
  userId: string;
  isCurrentlyLiked: boolean;
};

export type CommentState = Record<string, GaleriaComment[]>;

export type CommentAction =
  | { type: 'add'; photo: string; comment: GaleriaComment }
  | { type: 'edit'; photo: string; commentId: string; text: string }
  | { type: 'delete'; photo: string; commentId: string };

const toggleUser = (
  likes: string[],
  userId: string,
  isCurrentlyLiked: boolean
): string[] => {
  if (isCurrentlyLiked) {
    return likes.filter((uid) => uid !== userId);
  }
  return likes.includes(userId) ? likes : [...likes, userId];
};

export const likesReducer = (
  state: LikeState,
  action: LikeAction
): LikeState => ({
  ...state,
  likes: {
    ...state.likes,
    [action.photo]: toggleUser(
      state.likes[action.photo] ?? [],
      action.userId,
      action.isCurrentlyLiked
    ),
  },
});

export const commentsReducer = (
  state: CommentState,
  action: CommentAction
): CommentState => {
  const current = state[action.photo] ?? [];

  switch (action.type) {
    case 'add':
      return { ...state, [action.photo]: [...current, action.comment] };
    case 'edit':
      return {
        ...state,
        [action.photo]: current.map((c) =>
          c.id === action.commentId ? { ...c, comment: action.text } : c
        ),
      };
    case 'delete':
      return {
        ...state,
        [action.photo]: current.filter((c) => c.id !== action.commentId),
      };
  }
};
