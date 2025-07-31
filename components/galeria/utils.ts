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
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = url.split('/').pop() ?? 'photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Erro ao baixar a foto:', error);
    window.open(url, '_blank');
  }
};
