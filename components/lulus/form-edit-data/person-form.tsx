import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Person, PixTypes } from '../types';
import { NameKey } from '../utils';
import { personSchema } from './validation';
import { useUpdateParticipantData } from '@/services/queries/updateParticipant';
import { defaultValuesPerson } from './utils';

export type PersonFormData = z.infer<typeof personSchema>;

interface PersonFormProps {
  initialData: Person;
}

const PersonForm = ({ initialData }: PersonFormProps) => {
  const router = useRouter();
  const defaultValues = defaultValuesPerson(initialData);
  const { mutate } = useUpdateParticipantData(String(initialData.id));
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues,
  });

  const selectedPixKeyType = watch('pix_key_type');

  function onSubmit(data: PersonFormData) {
    mutate(
      {
        updatedData: {
          ...data,
          date: new Date(data.date).toISOString(),
        },
      },
      { onSuccess: () => router.push('/') }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
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
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="date">Data de nascimento</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          className="input"
          required
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="Email"
          className="input"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Celular</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Telefone"
          className="input"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          type="text"
          {...register('instagram')}
          placeholder="Instagram"
          className="input"
          disabled={!!initialData.instagram}
        />
        {errors.instagram && (
          <p className="text-red-500 text-sm mt-1">
            {errors.instagram.message}
          </p>
        )}
      </div>

      <div className="border-2 rounded-sm p-3 md:p-4 space-y-3">
        <p className="text-sm font-bold">Pix</p>
        <div>
          <Label>Tipo de chave Pix</Label>
          <Controller
            control={control}
            name="pix_key_type"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue="none"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo de chave Pix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(
                      ['cpf', 'email', 'phone', 'random', 'none'] as PixTypes[]
                    ).map((type) => (
                      <SelectItem key={type} value={type}>
                        {NameKey[type ?? 'none']}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
          />
          {errors.pix_key && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pix_key.message}
            </p>
          )}
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
        <Button type="submit" className="btn btn-primary flex-1 md:flex-none">
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default PersonForm;
