'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SelectWithOptions } from '@/components/ui/select-with-options';

import { useUpdateParticipantData } from '@/services/queries/updateParticipant';
import { useUserVerification } from '@/hooks/user-verify';
import type { Person } from '../types';
import { giftProfileSchema, shirtSizes } from './validation';

type GiftProfileFormData = z.infer<typeof giftProfileSchema>;

type FormMode = 'admin' | 'self-edit';

interface GiftProfileFormProps {
  participantId: string;
  initialData: Person;
  mode?: FormMode;
}

const ESTADOS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export const GiftProfileForm = ({
  participantId,
  initialData,
  mode = 'self-edit',
}: GiftProfileFormProps) => {
  const { user } = useUserVerification();
  const { mutate, isPending } = useUpdateParticipantData(participantId, mode);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GiftProfileFormData>({
    resolver: zodResolver(giftProfileSchema),
    defaultValues: {
      wishList: initialData.wishList ?? [],
      shirtSize:
        (initialData.shirtSize as GiftProfileFormData['shirtSize']) ?? '',
      shoeSize: initialData.shoeSize ?? '',
      favoriteColor: initialData.favoriteColor ?? '',
      allergies: initialData.allergies ?? '',
      address: initialData.address ?? {},
      hobbies: initialData.hobbies ?? '',
      favoriteStore: initialData.favoriteStore ?? '',
      giftNotes: initialData.giftNotes ?? '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'wishList',
  });

  const onSubmit = (data: GiftProfileFormData) => {
    if (!user) {
      toast.error('Você precisa estar logada');
      return;
    }

    mutate(
      {
        updatedData: {
          ...data,
          shirtSize: data.shirtSize === '' ? undefined : data.shirtSize,
        },
        userId: user.uid,
        userName: user.displayName ?? user.email ?? 'Usuário',
        userEmail: user.email ?? undefined,
        auditMetadata: { source: `${mode}-gift-profile` },
      },
      {
        onSuccess: () => {
          toast.success('Informações de presente atualizadas!', {
            position: 'bottom-center',
          });
        },
        onError: () => {
          toast.error('Erro ao salvar informações');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      <div className="border-2 rounded-sm p-3 md:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Lista de Desejos</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ item: '', url: '', preco: undefined, comprado: false })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-sm p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Item {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                aria-label={`Remover item ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Input
              {...register(`wishList.${index}.item`)}
              placeholder="Nome do item"
              error={errors.wishList?.[index]?.item?.message}
            />
            <Input
              {...register(`wishList.${index}.url`)}
              placeholder="Link do produto (opcional)"
              error={errors.wishList?.[index]?.url?.message}
            />
            <Input
              {...register(`wishList.${index}.preco`, { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="Preço estimado (opcional)"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tamanho de camiseta</Label>
          <SelectWithOptions
            value={''}
            onValueChange={() => {}}
            options={shirtSizes.map((s) => ({ value: s, label: s }))}
            placeholder="Selecione"
            triggerClassName="w-full"
            {...register('shirtSize')}
          />
        </div>

        <div>
          <Label htmlFor="shoeSize">Tamanho de calçado</Label>
          <Input id="shoeSize" {...register('shoeSize')} placeholder="Ex: 37" />
        </div>

        <div>
          <Label htmlFor="favoriteColor">Cor favorita</Label>
          <Input
            id="favoriteColor"
            {...register('favoriteColor')}
            placeholder="Ex: azul"
          />
        </div>

        <div>
          <Label htmlFor="favoriteStore">Loja preferida</Label>
          <Input
            id="favoriteStore"
            {...register('favoriteStore')}
            placeholder="Ex: Renner, Amazon"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="hobbies">Hobbies e interesses</Label>
        <Textarea
          id="hobbies"
          {...register('hobbies')}
          placeholder="O que você gosta de fazer?"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="allergies">
          Alergias (alimentares, cosméticos, etc.)
        </Label>
        <Textarea
          id="allergies"
          {...register('allergies')}
          placeholder="Informe suas alergias"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="giftNotes">
          Observações para quem for comprar presente
        </Label>
        <Textarea
          id="giftNotes"
          {...register('giftNotes')}
          placeholder="Dicas, preferências, o que evitar..."
          rows={3}
        />
      </div>

      <div className="border-2 rounded-sm p-3 md:p-4 space-y-3">
        <p className="text-sm font-bold">Endereço para entrega</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              {...register('address.cep')}
              placeholder="00000-000"
              error={errors.address?.cep?.message}
            />
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <SelectWithOptions
              value={''}
              onValueChange={() => {}}
              options={ESTADOS.map((e) => ({ value: e, label: e }))}
              placeholder="UF"
              triggerClassName="w-full"
              {...register('address.estado')}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="rua">Rua</Label>
            <Input id="rua" {...register('address.rua')} placeholder="Rua" />
          </div>
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              {...register('address.numero')}
              placeholder="Nº"
            />
          </div>
          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              {...register('address.complemento')}
              placeholder="Apto, bloco..."
            />
          </div>
          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              {...register('address.bairro')}
              placeholder="Bairro"
            />
          </div>
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              {...register('address.cidade')}
              placeholder="Cidade"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={!isDirty || isPending} className="w-full">
        {isPending ? 'Salvando...' : 'Salvar Informações de Presente'}
      </Button>
    </form>
  );
};
