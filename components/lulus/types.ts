export interface Person {
  id: number;
  name: string;
  date: Date | string;
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
  /** Timestamp when photo was last updated (for cache busting) */
  photoUpdatedAt?: number;
}

export type PixTypes = 'cpf' | 'email' | 'phone' | 'random' | 'none';
