import { cloudinaryUpload } from '../cloudinary';

export const uploadGalleryPhoto = async ({
  file,
  photoId,
}: {
  file: File;
  photoId: string;
}) => {
  await cloudinaryUpload({
    file,
    folder: 'gallery',
    publicId: photoId,
  });
};
