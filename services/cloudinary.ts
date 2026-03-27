import { getAuth } from 'firebase/auth';

const getAuthToken = async (): Promise<string> => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  return user.getIdToken();
};

export const cloudinaryUpload = async ({
  file,
  folder,
  publicId,
}: {
  file: File;
  folder: string;
  publicId: string;
}): Promise<{ url: string; publicId: string }> => {
  const token = await getAuthToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  formData.append('publicId', publicId);

  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Erro ao fazer upload');
  }

  return response.json();
};

export const cloudinaryDelete = async (publicId: string): Promise<void> => {
  const token = await getAuthToken();

  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Erro ao deletar imagem');
  }
};

export const cloudinaryListGallery = async (): Promise<string[]> => {
  const response = await fetch('/api/cloudinary/list');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? 'Erro ao listar galeria');
  }

  const data = await response.json();
  return data.urls;
};
