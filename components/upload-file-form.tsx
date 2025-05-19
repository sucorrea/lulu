'use client';
import { ChangeEvent, useState } from 'react';

import LulusCardEdit from './lulus/lulu-card-edit';
import { Person } from './lulus/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useUploadPhoto } from '@/hooks/useUploadPhoto';

type Props = {
  participantId: string;
  participant: Person | null;
};

export default function UpdateParticipantPhoto({
  participantId,
  participant,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const { mutate, isPending, isSuccess, isError, error } = useUploadPhoto();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus('Uploading...');
    mutate(
      { file, participantId },
      {
        onSuccess: () => {
          setStatus('Photo updated successfully!');
        },
        onError: () => {
          setStatus('Error uploading photo');
        },
      }
    );
  };

  return (
    <>
      <LulusCardEdit participante={participant} />
      <div className="space-y-2 p-6">
        <h2>Update Photo for Participant</h2>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={isPending}>
          Upload Photo
        </Button>
        <p>{status}</p>

        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Voltar para Home
        </Button>
        {isPending && <p>Uploading...</p>}
        {isSuccess && <p>Upload successful!</p>}
        {isError && <p>Error: {(error as Error).message}</p>}
      </div>
    </>
  );
}
