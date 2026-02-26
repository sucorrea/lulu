import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectWithOptions } from '@/components/ui/select-with-options';

import { useUpdateParticipantData } from '@/services/queries/updateParticipant';
import { useUserVerification } from '@/hooks/user-verify';
import { Person, PixTypes } from '../types';
import { NameKey } from '../utils';
import { defaultValuesPerson } from './utils';
import { personSchema } from './validation';

export type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  initialData: Person | null;
}

const PersonForm = ({ initialData }: PersonFormProps) => {
  const router = useRouter();
  const { user, isAdmin } = useUserVerification();
  const defaultValues = defaultValuesPerson(initialData ?? null);
  const { mutate } = useUpdateParticipantData(String(initialData?.id));
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues,
  });

  const selectedPixKeyType = watch('pix_key_type');

  const onSubmit = (data: PersonFormData) => {
    if (!initialData) {
      return;
    }

    if (!isAdmin || !user) {
      toast.error('Acesso restrito a administradores');
      return;
    }

    mutate(
      {
        updatedData: {
          ...data,
          date: new Date(data.date).toISOString(),
        },
        userId: user.uid,
        userName: user.displayName ?? user.email ?? 'Usuário',
        userEmail: user.email ?? undefined,
        auditMetadata: {
          source: 'web-form',
        },
      },
      {
        onSuccess: () => {
          toast.success('Dados atualizados com sucesso', {
            position: 'bottom-center',
          });
          router.push('/');
        },
        onError: () => {
          toast.error('Erro ao atualizar dados');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:space-y-4">
      <div>
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          type="text"
          {...register('fullName')}
          placeholder="Nome completo"
          className="input"
          required
          maxLength={80}
          error={errors.fullName?.message}
        />
      </div>

      <div>
        <Label htmlFor="date">Data de nascimento</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          className="input"
          required
          error={errors.date?.message}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Email"
          className="input"
          error={errors.email?.message}
        />
      </div>
      <div>
        <Label htmlFor="phone">Celular</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Telefone"
          className="input"
          error={errors.phone?.message}
        />
      </div>
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          type="text"
          {...register('instagram')}
          placeholder="Instagram"
          className="input"
          disabled={!!initialData?.instagram}
          error={errors.instagram?.message}
        />
      </div>

      <div className="border-2 rounded-sm p-3 md:p-4 space-y-3">
        <p className="text-sm font-bold">Pix</p>
        <div>
          <Label>Tipo de chave Pix</Label>
          <Controller
            control={control}
            name="pix_key_type"
            render={({ field }) => (
              <SelectWithOptions
                value={field.value}
                onValueChange={field.onChange}
                options={(
                  ['cpf', 'email', 'phone', 'random', 'none'] as PixTypes[]
                ).map((type) => ({
                  value: type,
                  label: NameKey[type ?? 'none'],
                }))}
                placeholder="Selecione um tipo de chave Pix"
                triggerClassName="w-full"
              />
            )}
          />
          {errors.pix_key_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pix_key_type.message}
            </p>
          )}
        </div>
        <div>
          <Label>Chave Pix</Label>
          <Input
            type="text"
            {...register('pix_key')}
            placeholder="Chave Pix"
            className="input"
            disabled={selectedPixKeyType === 'none'}
            error={errors.pix_key?.message}
          />
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex-1 md:flex-none"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="btn btn-primary flex-1 md:flex-none"
          disabled={!isDirty}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default PersonForm;
