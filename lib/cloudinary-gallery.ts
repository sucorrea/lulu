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

const listGalleryPage = async (cursor?: string): Promise<string[]> => {
  const result = (await cloudinary.api.resources({
    ...LIST_OPTIONS,
    next_cursor: cursor,
  })) as CloudinaryListResponse;

  const urls = result.resources.map((resource) => resource.secure_url);

  return result.next_cursor
    ? [...urls, ...(await listGalleryPage(result.next_cursor))]
    : urls;
};

export const listAllGalleryUrls = (): Promise<string[]> => listGalleryPage();
