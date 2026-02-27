import { toast } from 'sonner';

export const confirmDeletePhoto = (onConfirm: () => void) => {
  toast('Excluir esta foto?', {
    description: 'Esta ação não pode ser desfeita.',
    position: 'bottom-center',
    action: { label: 'Excluir', onClick: onConfirm },
    cancel: { label: 'Cancelar', onClick: () => {} },
  });
};

export const onGetPhotoId = (photo: string) => {
  try {
    const url = new URL(photo);
    const path = url.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  } catch {
    return photo;
  }
};

export const downloadPhoto = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = globalThis.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = url.split('/').pop() ?? 'photo.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    globalThis.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Erro ao baixar a foto:', error);
    window.open(url, '_blank');
  }
};
