'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserVerification } from '@/hooks/user-verify';
import {
  addCommentToPhoto,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
  listenPhotoComments,
} from '@/services/galeriaComments';
import {
  likePhoto,
  listenPhotoLikes,
  unlikePhoto,
} from '@/services/galeriaLikes';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import LikeUnlikeButton from './like-unlike-button';
import EditDeleteButtom from './edit-delete-buttom';
import { downloadPhoto, onGetPhotoId } from './utils';
import UploadPhotoGallery from './upload-photo-gallery';

type GaleriaComment = {
  id: string;
  userId: string;
  displayName: string;
  comment: string;
  createdAt?: string;
  editedAt?: string;
};

const GaleriaFotos = () => {
  const { data, isLoading } = useGetGalleryImages();
  const photos = useMemo(() => data || [], [data]);
  const { user } = useUserVerification();
  const router = useRouter();

  const [selected, setSelected] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [likes, setLikes] = useState(Array(photos.length).fill(0));
  const [liked, setLiked] = useState<boolean[]>(
    Array(photos.length).fill(false)
  );
  const [comments, setComments] = useState<string[][]>(
    Array(photos.length).fill([])
  );

  const [firestoreLikes, setFirestoreLikes] = useState<{
    [photo: string]: string[];
  }>({});

  const [firestoreComments, setFirestoreComments] = useState<{
    [photo: string]: GaleriaComment[];
  }>({});

  const getPhotoId = useCallback((photo: string) => onGetPhotoId(photo), []);

  useEffect(() => {
    if (!photos.length) return;
    const unsubscribes = photos.map((photo: string) =>
      listenPhotoLikes(getPhotoId(photo), (users) => {
        setFirestoreLikes((prev) => ({ ...prev, [photo]: users }));
      })
    );
    return () => {
      unsubscribes.forEach((u) => u());
    };
  }, [photos, getPhotoId]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setLiked(
      photos.map((photo) => firestoreLikes[photo]?.includes(user.uid) || false)
    );
    setLikes(photos.map((photo) => firestoreLikes[photo]?.length || 0));
  }, [firestoreLikes, user, photos]);

  const handleLike = useCallback(
    async (idx: number) => {
      if (!user) {
        return router.push('/login');
      }
      const photo = photos[idx];
      const photoId = getPhotoId(photo);
      if (liked[idx]) {
        await unlikePhoto(photoId, user.uid);
      } else {
        await likePhoto(photoId, user.uid);
      }
    },
    [user, router, photos, liked, getPhotoId]
  );

  useEffect(() => {
    if (!photos.length) {
      return;
    }
    const unsubscribes = photos.map((photo: string) =>
      listenPhotoComments(getPhotoId(photo), (comments) => {
        setFirestoreComments((prev) => ({ ...prev, [photo]: comments }));
      })
    );
    return () => {
      unsubscribes.forEach((u) => u());
    };
  }, [photos, getPhotoId]);

  useEffect(() => {
    setComments(
      photos.map(
        (photo) =>
          firestoreComments[photo]?.map((coments) => coments.comment) || []
      )
    );
  }, [firestoreComments, photos]);

  const handleComment = useCallback(
    async (idx: number) => {
      if (!user || !commentInput.trim()) return null;
      const photo = photos[idx];
      const photoId = getPhotoId(photo);
      await addCommentToPhoto(photoId, {
        userId: user.uid,
        displayName: user.displayName || user.email || 'Usuário',
        comment: commentInput.trim(),
      });
      setCommentInput('');
    },
    [user, commentInput, photos, getPhotoId]
  );

  const handleDeleteComment = useCallback(
    async (photoId: string, commentId: string) => {
      await deleteCommentFromPhoto(photoId, commentId);
    },
    []
  );

  const handleEditComment = useCallback(
    async (photoId: string, commentId: string, newText: string) => {
      await editCommentOnPhoto(photoId, commentId, newText);
    },
    []
  );

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const handlePrev = useCallback(() => {
    if (selected !== null)
      setSelected((selected - 1 + photos.length) % photos.length);
  }, [selected, photos.length]);

  const handleNext = useCallback(() => {
    if (selected !== null) setSelected((selected + 1) % photos.length);
  }, [selected, photos.length]);

  const handleEditCommentSelected = useCallback(
    (comentSelected: GaleriaComment) => {
      setEditingCommentId(comentSelected.id);
      setEditInput(comentSelected.comment);
    },
    [setEditingCommentId, setEditInput]
  );

  const handleDownload = useCallback((url: string) => {
    downloadPhoto(url);
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="lulu-header mb-0 text-2xl md:text-3xl">Galeria</h1>
        <UploadPhotoGallery />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {isLoading
          ? Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className="relative group"
                data-testid="skeleton-item"
              >
                <button
                  onClick={() => setSelected(idx)}
                  className="block w-full aspect-square overflow-hidden rounded shadow"
                  disabled
                >
                  <Skeleton key={idx} className="w-full aspect-square" />
                </button>
              </div>
            ))
          : photos.map((photo, idx) => (
              <div key={photo} className="relative group">
                <button
                  onClick={() => setSelected(idx)}
                  className="block w-full aspect-square overflow-hidden rounded shadow"
                >
                  <Image
                    src={photo}
                    alt={photo}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </button>
                <div className="mt-1 flex items-center justify-between">
                  <LikeUnlikeButton
                    handleLike={() => handleLike(idx)}
                    liked={liked}
                    likes={likes}
                    index={idx}
                  />
                  <button
                    onClick={() => setSelected(idx)}
                    className="flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Ver comentários da foto"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments[idx]?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))}
      </div>
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-4 top-4 text-2xl text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
            onClick={() => setSelected(null)}
            aria-label="Fechar"
          >
            <X />
          </button>
          <div className="relative flex w-full max-w-md items-center justify-center">
            <button
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center"
              style={{ left: 8 }}
            >
              <ChevronLeft />
            </button>
            <div className="flex flex-1 justify-center">
              <Image
                src={photos[selected]}
                alt={photos[selected]}
                width={400}
                height={400}
                className="object-contain rounded max-h-[60vh] max-w-full"
              />
            </div>
            <button
              onClick={handleNext}
              aria-label="Próxima foto"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center"
              style={{ right: 8 }}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="mt-2 w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lulu-md">
            <div className="mb-2 flex justify-between gap-4">
              <LikeUnlikeButton
                handleLike={() => handleLike(selected)}
                liked={liked}
                likes={likes}
                index={selected}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDownload(photos[selected])}
                aria-label="Baixar foto"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-2 max-h-24 overflow-y-auto">
              {firestoreComments[photos[selected]]?.map((comentSelected, i) => {
                const isAuthor = user && comentSelected.userId === user.uid;
                const isEditing = editingCommentId === comentSelected.id;
                return (
                  <div
                    key={comentSelected.id ?? i}
                    className="text-sm text-gray-700 border-b py-1 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1">
                      <span className="font-semibold mr-1">
                        {comentSelected.displayName}:
                      </span>
                      {isEditing ? (
                        <div>
                          <Input
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="px-1 py-0.5 text-sm"
                          />
                          <Button
                            size="sm"
                            className="ml-1 px-2 py-0.5"
                            onClick={async () => {
                              await handleEditComment(
                                getPhotoId(photos[selected]),
                                comentSelected.id,
                                editInput
                              );
                              setEditingCommentId(null);
                            }}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-1 px-2 py-0.5"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <span>{comentSelected.comment}</span>
                      )}
                    </div>
                    {isAuthor && !isEditing && (
                      <EditDeleteButtom
                        onEdit={handleEditCommentSelected}
                        onDelete={async () => {
                          await handleDeleteComment(
                            getPhotoId(photos[selected]),
                            comentSelected.id
                          );
                        }}
                        comentSelected={comentSelected}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="border rounded px-2 py-1 flex-1 text-sm"
                placeholder={
                  !user ? 'Faça login para comentar' : 'Comente algo...'
                }
                disabled={!user}
              />
              <Button
                onClick={() => handleComment(selected)}
                disabled={!user || !commentInput.trim()}
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaFotos;
