import { cloudinaryDelete } from '../cloudinary';
import { extractCloudinaryPublicId } from './extractCloudinaryPublicId';

const INVALID_URL_ERROR = 'URL de foto inválida';
const CLOUDINARY_DOMAIN = 'res.cloudinary.com';

export const deleteGalleryPhoto = async (photoUrl: string) => {
  let url: URL;
  try {
    url = new URL(photoUrl);
  } catch {
    throw new Error(INVALID_URL_ERROR);
  }

  if (!url.hostname.includes(CLOUDINARY_DOMAIN)) {
    throw new Error(INVALID_URL_ERROR);
  }

  const publicId = extractCloudinaryPublicId(url.pathname);
  if (!publicId) {
    throw new Error(INVALID_URL_ERROR);
  }

  await cloudinaryDelete(publicId);
};
