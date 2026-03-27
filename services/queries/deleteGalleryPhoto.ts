import { cloudinaryDelete } from '../cloudinary';

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

  const pathParts = url.pathname.split('/upload/');
  if (!pathParts[1]) {
    throw new Error(INVALID_URL_ERROR);
  }

  const publicIdWithExt = pathParts[1].replace(/^v\d+\//, '');
  const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');

  await cloudinaryDelete(publicId);
};
