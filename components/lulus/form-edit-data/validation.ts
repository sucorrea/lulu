import { z } from 'zod';

const addressSchema = z.object({
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .optional()
    .or(z.literal('')),
  rua: z.string().max(120).optional(),
  numero: z.string().max(10).optional(),
  complemento: z.string().max(60).optional(),
  bairro: z.string().max(60).optional(),
  cidade: z.string().max(60).optional(),
  estado: z.string().max(2).optional(),
});

const wishListItemSchema = z.object({
  item: z.string().min(1, 'Nome do item é obrigatório').max(120),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  preco: z.coerce.number().min(0).optional(),
  comprado: z.boolean().optional(),
  compradorNome: z.string().max(80).optional(),
});

export const shirtSizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const;

export const personSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .max(80, 'Máximo de 80 caracteres'),
  date: z.string().nonempty('Data é obrigatória'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  pix_key_type: z.enum(['cpf', 'email', 'phone', 'random', 'none']),
  pix_key: z.string().optional(),
});

export const giftProfileSchema = z.object({
  wishList: z.array(wishListItemSchema).optional(),
  shirtSize: z.enum(shirtSizes).optional().or(z.literal('')),
  shoeSize: z.string().max(10).optional(),
  favoriteColor: z.string().max(40).optional(),
  allergies: z.string().max(300).optional(),
  address: addressSchema.optional(),
  hobbies: z.string().max(300).optional(),
  favoriteStore: z.string().max(120).optional(),
  giftNotes: z.string().max(500).optional(),
});

export const fullPersonSchema = personSchema.merge(giftProfileSchema);
