import { uploadPhoto } from '@/services/queries/uploadPhoto';
import { useMutation } from '@tanstack/react-query';

export function useUploadPhoto() {
  return useMutation({ mutationFn: uploadPhoto });
}
