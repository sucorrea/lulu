export interface WishListItem {
  item: string;
  url?: string;
  preco?: number;
  comprado?: boolean;
  compradorNome?: string;
}

export interface Address {
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export type Role = 'admin' | 'lulu' | 'visitante';

export type ShirtSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export interface Person {
  id: number;
  editToken?: string;
  name: string;
  date: Date | string;
  month: string;
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
  uid?: string;
  authEmail?: string;
  role?: Role;
  fcmTokens?: string[];
  wishList?: WishListItem[];
  shirtSize?: ShirtSize;
  shoeSize?: string;
  favoriteColor?: string;
  allergies?: string;
  address?: Address;
  hobbies?: string;
  favoriteStore?: string;
  giftNotes?: string;
}

export type PixTypes = 'cpf' | 'email' | 'phone' | 'random' | 'none';
