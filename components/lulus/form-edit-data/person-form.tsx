import React, { ChangeEvent, useState } from 'react';
import { Person, PixTypes } from '../types';
import { Input } from '@/components/ui/input';
import { NameKey } from '../utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
interface PersonFormProps {
  initialData: Person;
  onSubmit: (data: Person) => void;
}

const pixTypes: PixTypes[] = ['cpf', 'email', 'phone', 'random', 'none'];

export default function PersonForm({ initialData, onSubmit }: PersonFormProps) {
  const [form, setForm] = useState<Person>(initialData);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSelectChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Nome completo"
        className="input"
        required
        maxLength={80}
      />
      <Input
        type="date"
        name="date"
        value={
          form.date instanceof Date
            ? form.date.toISOString().substring(0, 10)
            : form.date
        }
        onChange={handleChange}
        className="input"
        required
      />

      <Label htmlFor="email">
        Email
        <Input
          id="email"
          type="email"
          name="email"
          value={form.email || ''}
          onChange={handleChange}
          placeholder="Email"
          className="input"
        />
      </Label>
      <Label htmlFor="phone">
        Celular
        <Input
          id="phone"
          type="tel"
          name="phone"
          value={form.phone || ''}
          onChange={handleChange}
          placeholder="Telefone"
          className="input"
        />
      </Label>
      <Label htmlFor="instagram">
        Instagram
        <Input
          type="text"
          id="instagram"
          name="instagram"
          value={`@${form.instagram || ''}`}
          onChange={handleChange}
          placeholder="Instagram"
          className="input"
          disabled={!!form.instagram}
        />
      </Label>
      <div className="border-2 rounded-sm border- p-2 gap-2">
        <p className="text-sm font-bold">Pix</p>
        <Label>
          Tipo de chave Pix
          <Select
            value={form.pix_key_type}
            onValueChange={(value) => handleSelectChange('pix_key_type', value)}
            defaultValue="none"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um tipo de chave Pix" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pixTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {NameKey[type ?? 'none']}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>

        <Label>
          Chave Pix
          <Input
            type="text"
            name="pix_key"
            value={form.pix_key || ''}
            onChange={handleChange}
            placeholder="Chave Pix"
            className="input"
            disabled={form.pix_key_type === 'none'}
          />
        </Label>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Voltar
        </Button>
        <Button type="submit" className="btn btn-primary">
          Salvar
        </Button>
      </div>
    </form>
  );
}
