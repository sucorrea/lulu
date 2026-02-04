import { Person } from '../types';

export const defaultValuesPerson = (initialValues: Person | null) => ({
  fullName: initialValues?.fullName ?? '',
  date: initialValues?.date
    ? new Date(initialValues.date).toISOString().split('T')[0]
    : '',
  email: initialValues?.email ?? '',
  phone: initialValues?.phone ?? '',
  instagram: initialValues?.instagram ?? '',
  pix_key_type: initialValues?.pix_key_type ?? 'none',
  pix_key: initialValues?.pix_key ?? '',
});
