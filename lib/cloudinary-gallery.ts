import cloudinary from '@/lib/cloudinary';

type CloudinaryResource = {
  secure_url: string;
};

type CloudinaryListResponse = {
  next_cursor?: string;
  resources: CloudinaryResource[];
};

const LIST_OPTIONS = {
  type: 'upload' as const,
  prefix: 'gallery/',
  max_results: 500,
  resource_type: 'image' as const,
};

export const listAllGalleryUrls = async (): Promise<string[]> => {
  const urls: string[] = [];
  let nextCursor: string | undefined;

  do {
    const result = (await cloudinary.api.resources({
      ...LIST_OPTIONS,
      next_cursor: nextCursor,
    })) as CloudinaryListResponse;

    urls.push(...result.resources.map((resource) => resource.secure_url));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return urls;
};
