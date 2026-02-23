'use client';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Person } from '@/components/lulus/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectWithOptions } from '@/components/ui/select-with-options';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

const formSchema = z.object({
  year: z.coerce
    .number()
    .min(2000, 'Ano deve ser maior que 2000')
    .max(2026, 'Ano deve ser menor que 2026'),
  responsibleId: z.coerce.number().min(1, 'Selecione quem foi responsável'),
  birthdayPersonId: z.coerce.number().min(1, 'Selecione o aniversariante'),
});

type FormData = z.infer<typeof formSchema>;

type ParticipantFieldName = 'birthdayPersonId' | 'responsibleId';

const getDefaultValues = (editingItem?: VaquinhaHistory | null): FormData => ({
  year: editingItem?.year ?? new Date().getFullYear(),
  responsibleId: editingItem?.responsibleId ?? 0,
  birthdayPersonId: editingItem?.birthdayPersonId ?? 0,
});

type ParticipantSelectFieldProps = {
  control: Control<FormData>;
  name: ParticipantFieldName;
  label: string;
  participants: Person[];
};

const ParticipantSelectField = ({
  control,
  name,
  label,
  participants,
}: ParticipantSelectFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <SelectWithOptions
          value={field.value > 0 ? field.value : ''}
          onValueChange={(value) => field.onChange(Number(value))}
          options={participants.map((p) => ({
            value: p.id,
            label: p.name,
          }))}
          placeholder="Selecione..."
          triggerWrapper={FormControl}
        />
        <FormMessage />
      </FormItem>
    )}
  />
);

interface VaquinhaHistoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: FormData & {
      responsibleName: string;
      birthdayPersonName: string;
      birthdayDate: string;
    }
  ) => void;
  participants: Person[];
  editingItem?: VaquinhaHistory | null;
  isLoading?: boolean;
}

export const VaquinhaHistoryFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  participants,
  editingItem,
  isLoading,
}: VaquinhaHistoryFormDialogProps) => {
  let submitLabel = 'Adicionar';

  if (isLoading) {
    submitLabel = 'Salvando...';
  } else if (editingItem) {
    submitLabel = 'Atualizar';
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(editingItem),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(getDefaultValues(editingItem));
  }, [open, editingItem, form]);

  const handleSubmit = (data: FormData) => {
    const responsible = participants.find((p) => p.id === data.responsibleId);
    const birthdayPerson = participants.find(
      (p) => p.id === data.birthdayPersonId
    );

    if (!responsible || !birthdayPerson) {
      return;
    }

    onSubmit({
      ...data,
      responsibleName: responsible.name,
      birthdayPersonName: birthdayPerson.name,
      birthdayDate: String(birthdayPerson.date),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Editar' : 'Adicionar'} Histórico de Vaquinha
          </DialogTitle>
          <DialogDescription>
            Registre quem foi responsável pela vaquinha e quem foi o
            aniversariante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2026"
                      {...field}
                      max={2026}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ParticipantSelectField
              control={form.control}
              name="birthdayPersonId"
              label="Aniversariante"
              participants={participants}
            />
            <ParticipantSelectField
              control={form.control}
              name="responsibleId"
              label="Quem foi responsável"
              participants={participants}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="capitalize">
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
