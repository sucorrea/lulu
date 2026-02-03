import { cache } from 'react';

import {
  fetchParticipants,
  fetchParticipantById,
} from '@/services/queries/fetchParticipants';

export const getParticipants = cache(async () => {
  return fetchParticipants();
});

export const getParticipantById = cache(async (id: string) => {
  return fetchParticipantById(id);
});
