import { z } from 'zod';

export const personSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .max(80, 'Máximo de 80 caracteres'),
  date: z.string().nonempty('Data é obrigatória'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  pix_key_type: z.enum(['cpf', 'email', 'phone', 'random', 'none']),
  pix_key: z.string().optional(),
});
