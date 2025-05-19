export interface Person {
  id: number;
  name: string;
  date: Date;
  month: string;
  gives_to: string;
  gives_to_id: number;
  email?: string;
  phone?: string;
  picture?: string;
  instagram?: string;
  pix_key?: string;
  pix_key_type?: PixTypes;
  fullName: string;
  city: string;
  photoURL?: string;
}

export type PixTypes = 'cpf' | 'email' | 'phone' | 'random' | 'none';
