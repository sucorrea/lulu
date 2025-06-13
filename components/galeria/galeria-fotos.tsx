'use client';
import React, { useState, useEffect, useMemo } from 'react';

import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import LikeUnlikeButton from './like-unlike-button';
import { useGetGalleryImages } from '@/services/queries/fetchParticipants';
import BounceLoader from 'react-spinners/BounceLoader';
import { useUserVerification } from '@/hooks/user-verify';
import {
  likePhoto,
  unlikePhoto,
  listenPhotoLikes,
} from '@/services/galeriaLikes';
import {
  addCommentToPhoto,
  listenPhotoComments,
  deleteCommentFromPhoto,
  editCommentOnPhoto,
} from '@/services/galeriaComments';

// const photos = [
//   'Aline.jpg',
//   'AnaPaulaMaita.jpg',
//   'Aninha.png',
//   'Camila.jpg',
//   'CarolMaita.jpg',
//   'CarolMori.jpg',
//   'Cassia.jpg',
//   'Deborah.jpg',
//   'Deia.jpg',
//   'faLulu.jpg',
//   'Izadora.jpg',
//   'Josy.jpg',
//   'Leticia.jpg',
//   'lulu.jpg',
//   'luluzinha.jpg',
//   'Nani.jpg',
//   'Stella.jpg',
//   'Sueli.jpg',
//   'Sylvia.jpg',
//   'Vanessa.jpg',
//   'Vivi.jpg',
//   'Vladia.jpg',
// ];

// Ajuste no tipo GaleriaComment para incluir id e editedAt
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
  const [selected, setSelected] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean[]>(
    Array(photos.length).fill(false)
  );
  const [likes, setLikes] = useState(Array(photos.length).fill(0));
  const [comments, setComments] = useState<string[][]>(
    Array(photos.length).fill([])
  );
  const [commentInput, setCommentInput] = useState('');
  const { user } = useUserVerification();
  // Estado para likes vindos do Firestore
  const [firestoreLikes, setFirestoreLikes] = useState<{
    [photo: string]: string[];
  }>({});
  // Estado para comentários vindos do Firestore
  const [firestoreComments, setFirestoreComments] = useState<{
    [photo: string]: GaleriaComment[];
  }>({});

  // Utilitário para extrair o nome do arquivo de uma URL
  function getPhotoId(photo: string) {
    // Se for uma URL, pega só o nome do arquivo
    try {
      const url = new URL(photo);
      const path = url.pathname;
      return path.substring(path.lastIndexOf('/') + 1);
    } catch {
      // Se não for URL, retorna o próprio nome
      return photo;
    }
  }

  // Ouve likes de todas as fotos em tempo real
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
  }, [photos]);

  // Atualiza liked/likes conforme Firestore
  useEffect(() => {
    if (!user) return;
    setLiked(
      photos.map((photo) => firestoreLikes[photo]?.includes(user.uid) || false)
    );
    setLikes(photos.map((photo) => firestoreLikes[photo]?.length || 0));
  }, [firestoreLikes, user, photos]);

  // Nova função para curtir/descurtir no Firestore
  const handleLike = async (idx: number) => {
    if (!user) return;
    const photo = photos[idx];
    const photoId = getPhotoId(photo);
    if (liked[idx]) {
      await unlikePhoto(photoId, user.uid);
    } else {
      await likePhoto(photoId, user.uid);
    }
  };

  // Ouve comentários de todas as fotos em tempo real
  useEffect(() => {
    if (!photos.length) return;
    const unsubscribes = photos.map((photo: string) =>
      listenPhotoComments(getPhotoId(photo), (comments) => {
        setFirestoreComments((prev) => ({ ...prev, [photo]: comments }));
      })
    );
    return () => {
      unsubscribes.forEach((u) => u());
    };
  }, [photos]);

  // Atualiza comentários conforme Firestore
  useEffect(() => {
    setComments(
      photos.map(
        (photo) => firestoreComments[photo]?.map((c) => c.comment) || []
      )
    );
  }, [firestoreComments, photos]);

  // Nova função para comentar no Firestore
  const handleComment = async (idx: number) => {
    if (!user || !commentInput.trim()) return;
    const photo = photos[idx];
    const photoId = getPhotoId(photo);
    await addCommentToPhoto(photoId, {
      userId: user.uid,
      displayName: user.displayName || user.email || 'Usuário',
      comment: commentInput.trim(),
    });
    setCommentInput('');
  };

  // Função para deletar comentário
  const handleDeleteComment = async (photoId: string, commentId: string) => {
    await deleteCommentFromPhoto(photoId, commentId);
  };

  // Função para editar comentário
  const handleEditComment = async (
    photoId: string,
    commentId: string,
    newText: string
  ) => {
    await editCommentOnPhoto(photoId, commentId, newText);
  };

  // Estado para edição
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');

  const handlePrev = () => {
    if (selected !== null)
      setSelected((selected - 1 + photos.length) % photos.length);
  };
  const handleNext = () => {
    if (selected !== null) setSelected((selected + 1) % photos.length);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#F43F5E" />{' '}
      </div>
    );

  return (
    <div className="p-2 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Galeria</h1>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {photos.map((photo, idx) => (
          <div key={photo} className="relative group">
            <button
              onClick={() => setSelected(idx)}
              className="block w-full aspect-square overflow-hidden rounded shadow"
            >
              <Image
                src={`${photo}`}
                alt={photo}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </button>
            <div className="flex justify-between items-center mt-1">
              <LikeUnlikeButton
                handleLike={() => handleLike(idx)}
                liked={liked}
                likes={likes}
                index={idx}
              />
              <button
                onClick={() => setSelected(idx)}
                className="flex justify-center items-center gap-1  text-sm"
              >
                <MessageCircle size={15} color="blue" />{' '}
                {comments[idx]?.length || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <div className="relative flex items-center w-full max-w-md justify-center">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center"
              style={{ left: 8 }}
            >
              <ChevronLeft />
            </button>
            <div className="flex-1 flex justify-center">
              <Image
                src={`${photos[selected]}`}
                alt={photos[selected]}
                width={400}
                height={400}
                className="object-contain rounded max-h-[60vh] max-w-full"
              />
            </div>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-3xl px-2 z-10 bg-black/30 rounded-full h-10 w-10 flex items-center justify-center"
              style={{ right: 8 }}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="bg-white rounded p-4 mt-2 w-full max-w-md">
            <div className="flex items-center gap-4 mb-2">
              <LikeUnlikeButton
                handleLike={() => handleLike(selected)}
                liked={liked}
                likes={likes}
                index={selected}
              />

              <span className="text-gray-500 text-sm">{photos[selected]}</span>
            </div>
            <div className="mb-2 max-h-24 overflow-y-auto">
              {firestoreComments[photos[selected]]?.map((c, i) => {
                const isAuthor = user && c.userId === user.uid;
                const isEditing = editingCommentId === c.id;
                return (
                  <div
                    key={c.id || i}
                    className="text-sm text-gray-700 border-b py-1 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1">
                      <span className="font-semibold mr-1">
                        {c.displayName}:
                      </span>{' '}
                      {isEditing ? (
                        <>
                          <Input
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="text-sm px-1 py-0.5"
                          />
                          <Button
                            size="sm"
                            className="ml-1 px-2 py-0.5"
                            onClick={async () => {
                              await handleEditComment(
                                getPhotoId(photos[selected]),
                                c.id,
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
                        </>
                      ) : (
                        <span>{c.comment}</span>
                      )}
                    </div>
                    {isAuthor && !isEditing && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="px-2 py-0.5"
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditInput(c.comment);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="px-2 py-0.5"
                          onClick={async () => {
                            await handleDeleteComment(
                              getPhotoId(photos[selected]),
                              c.id
                            );
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
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
                placeholder="Comente algo..."
              />
              <Button onClick={() => handleComment(selected)}>Enviar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaFotos;
