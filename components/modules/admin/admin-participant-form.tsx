'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectWithOptions } from '@/components/ui/select-with-options';
import { useCreateParticipant } from '@/services/queries/adminParticipants';
import type { Role } from '@/components/lulus/types';

const createParticipantSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .max(80, 'Máximo de 80 caracteres'),
  name: z.string().min(1, 'Apelido é obrigatório').max(40),
  date: z.string().nonempty('Data de nascimento é obrigatória'),
  month: z.string().min(1, 'Mês é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória').max(60),
  authEmail: z.string().email('E-mail inválido'),
  role: z.enum(['admin', 'lulu', 'visitante']),
});

type CreateParticipantFormData = z.infer<typeof createParticipantSchema>;

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const ROLES: { value: Role; label: string }[] = [
  { value: 'lulu', label: 'Lulu' },
  { value: 'admin', label: 'Admin' },
  { value: 'visitante', label: 'Visitante' },
];

export const AdminParticipantForm = () => {
  const { mutate, isPending } = useCreateParticipant();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateParticipantFormData>({
    resolver: zodResolver(createParticipantSchema),
    defaultValues: {
      fullName: '',
      name: '',
      date: '',
      month: '',
      city: '',
      authEmail: '',
      role: 'lulu',
    },
  });

  const onSubmit = (data: CreateParticipantFormData) => {
    mutate(
      {
        ...data,
        date: new Date(data.date).toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Lulu cadastrada com sucesso!', {
            position: 'bottom-center',
          });
          reset();
        },
        onError: () => {
          toast.error('Erro ao cadastrar lulu');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder="Nome completo"
          error={errors.fullName?.message}
        />
      </div>

      <div>
        <Label htmlFor="name">Apelido</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Apelido"
          error={errors.name?.message}
        />
      </div>

      <div>
        <Label htmlFor="date">Data de nascimento</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          error={errors.date?.message}
        />
      </div>

      <div>
        <Label>Mês de aniversário</Label>
        <Controller
          control={control}
          name="month"
          render={({ field }) => (
            <SelectWithOptions
              value={field.value}
              onValueChange={field.onChange}
              options={MONTHS.map((m) => ({ value: m, label: m }))}
              placeholder="Selecione o mês"
              triggerClassName="w-full"
            />
          )}
        />
        {errors.month && (
          <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="city">Cidade</Label>
        <Input
          id="city"
          {...register('city')}
          placeholder="Cidade"
          error={errors.city?.message}
        />
      </div>

      <div>
        <Label htmlFor="authEmail">E-mail de login (Google)</Label>
        <Input
          id="authEmail"
          type="email"
          {...register('authEmail')}
          placeholder="email@gmail.com"
          error={errors.authEmail?.message}
        />
      </div>

      <div>
        <Label>Role</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectWithOptions
              value={field.value}
              onValueChange={field.onChange}
              options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
              placeholder="Selecione o papel"
              triggerClassName="w-full"
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Cadastrando...' : 'Cadastrar Lulu'}
      </Button>
    </form>
  );
};
