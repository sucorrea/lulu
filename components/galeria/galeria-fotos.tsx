'use client';
import React, { useState } from 'react';

import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import LikeUnlikeButton from './like-unlike-button';

const photos = [
  'Aline.jpg',
  'AnaPaulaMaita.jpg',
  'Aninha.png',
  'Camila.jpg',
  'CarolMaita.jpg',
  'CarolMori.jpg',
  'Cassia.jpg',
  'Deborah.jpg',
  'Deia.jpg',
  'faLulu.jpg',
  'Izadora.jpg',
  'Josy.jpg',
  'Leticia.jpg',
  'lulu.jpg',
  'luluzinha.jpg',
  'Nani.jpg',
  'Stella.jpg',
  'Sueli.jpg',
  'Sylvia.jpg',
  'Vanessa.jpg',
  'Vivi.jpg',
  'Vladia.jpg',
];

const GaleriaFotos = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [liked, setLiked] = useState<boolean[]>(
    Array(photos.length).fill(false)
  );
  const [likes, setLikes] = useState(Array(photos.length).fill(0));
  const [comments, setComments] = useState<string[][]>(
    Array(photos.length).fill([])
  );
  const [commentInput, setCommentInput] = useState('');

  const handleLike = (idx: number) => {
    setLiked((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
    setLikes((prev) =>
      prev.map((l, i) => (i === idx ? (liked[idx] ? l - 1 : l + 1) : l))
    );
  };

  const handleComment = (idx: number) => {
    if (commentInput.trim()) {
      setComments((comments) =>
        comments.map((c, i) => (i === idx ? [...c, commentInput] : c))
      );
      setCommentInput('');
    }
  };

  const handlePrev = () => {
    if (selected !== null)
      setSelected((selected - 1 + photos.length) % photos.length);
  };
  const handleNext = () => {
    if (selected !== null) setSelected((selected + 1) % photos.length);
  };

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
                src={`/fotos/${photo}`}
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
                src={`/fotos/${photos[selected]}`}
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
              {comments[selected]?.map((c: string, i: number) => (
                <div key={i} className="text-sm text-gray-700 border-b py-1">
                  {c}
                </div>
              ))}
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
