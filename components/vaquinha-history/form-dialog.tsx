'use client';
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

const formSchema = z.object({
  year: z.coerce
    .number()
    .min(2000, 'Ano deve ser maior que 2000')
    .max(2100, 'Ano deve ser menor que 2100'),
  responsibleId: z.coerce.number().min(1, 'Selecione quem foi responsável'),
  birthdayPersonId: z.coerce.number().min(1, 'Selecione o aniversariante'),
});

type FormData = z.infer<typeof formSchema>;

interface VaquinhaHistoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: FormData & { responsibleName: string; birthdayPersonName: string }
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
  const submitLabel = (() => {
    if (isLoading) {
      return 'Salvando...';
    }
    if (editingItem) {
      return 'Atualizar';
    }
    return 'Adicionar';
  })();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      responsibleId: 0,
      birthdayPersonId: 0,
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        year: editingItem.year,
        responsibleId: editingItem.responsibleId,
        birthdayPersonId: editingItem.birthdayPersonId,
      });
    } else {
      form.reset({
        year: new Date().getFullYear(),
        responsibleId: 0,
        birthdayPersonId: 0,
      });
    }
  }, [editingItem, form]);

  const handleSubmit = (data: FormData) => {
    const responsible = participants.find((p) => p.id === data.responsibleId);
    const birthdayPerson = participants.find(
      (p) => p.id === data.birthdayPersonId
    );

    if (!responsible || !birthdayPerson) {
      return;
    }

    type SubmitData = {
      year: number;
      responsibleId: number;
      responsibleName: string;
      birthdayPersonId: number;
      birthdayPersonName: string;
      amount?: number;
      notes?: string;
    };

    const submitData: SubmitData = {
      year: data.year,
      responsibleId: data.responsibleId,
      responsibleName: responsible.name,
      birthdayPersonId: data.birthdayPersonId,
      birthdayPersonName: birthdayPerson.name,
    };

    onSubmit(submitData);

    form.reset();
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
                    <Input type="number" placeholder="2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdayPersonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aniversariante</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value > 0 ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsibleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quem foi responsável</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value > 0 ? field.value.toString() : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {participants.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
