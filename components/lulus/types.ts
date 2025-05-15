export interface Person {
  id: number;
  name: string;
  date: Date;
  month: string;
  gives_to: string;
  gives_to_id: number;
  favorite_color?: string;
  hobbies?: string;
  email?: string;
  phone?: string;
  preferences?: string;
  shirt_size?: string;
  shoe_size?: string;
  allergies?: string;
  picture?: string;
  instagram?: string;
  pix_key?: string;
  pix_key_type?: PixTypes;
  fullName: string;
  city: string;
}

export type PixTypes = 'cpf' | 'email' | 'phone' | 'random' | 'none';
