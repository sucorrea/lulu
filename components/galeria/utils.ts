export const onGetPhotoId = (photo: string) => {
  try {
    const url = new URL(photo);
    const path = url.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  } catch {
    return photo;
  }
};
