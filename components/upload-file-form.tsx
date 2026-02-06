'use client';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { useUploadPhoto } from '@/hooks/useUploadPhoto';

type UpdateParticipantPhotoProps = {
  participantId: string;
  setFile: Dispatch<SetStateAction<File | null>>;
};

const UpdateParticipantPhoto = ({
  participantId,
  setFile,
}: Readonly<UpdateParticipantPhotoProps>) => {
  const { isPending, isSuccess, isError, error } =
    useUploadPhoto(participantId);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 p-2 mt-2 cursor-pointer border-2 border-primary rounded-lg hover:border-primary/80 bg-primary/10 transition-colors">
      <label htmlFor="file-upload">
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />{' '}
        Escolher foto
      </label>
      {isPending && <p>Uploading...</p>}
      {isSuccess && <p>Foto Alterada</p>}
      {isError && <p>Error: {JSON.stringify(error.cause)}</p>}
      {isError && <p>Error: {JSON.stringify(error.message)}</p>}
    </div>
  );
};

export default UpdateParticipantPhoto;
