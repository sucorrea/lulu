const VERSION_PREFIX_REGEX = /^v\d+\//;
const EXTENSION_REGEX = /\.[^.]+$/;

export const extractCloudinaryPublicId = (pathname: string) => {
  const pathParts = pathname.split('/upload/');
  if (!pathParts[1]) {
    return null;
  }

  const decodedPath = decodeURIComponent(pathParts[1]);
  const publicIdWithExt = decodedPath.replace(VERSION_PREFIX_REGEX, '');

  return publicIdWithExt.replace(EXTENSION_REGEX, '');
};
