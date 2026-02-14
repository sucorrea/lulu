export interface Person {
  id: number;
  editToken?: string;
  name: string;
  date: Date | string;
  month: string;
  receives_to_id: number;
  email?: string;
  phone?: string;
  picture?: string;
  instagram?: string;
  pix_key?: string;
  pix_key_type?: PixTypes;
  fullName: string;
  city: string;
  photoURL?: string;
  photoUpdatedAt?: number;
}

export type PixTypes = 'cpf' | 'email' | 'phone' | 'random' | 'none';
