'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectWithOptionsProps = {
  value: string | number;
  onValueChange: (value: string) => void;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  triggerId?: string;
  triggerWrapper?: React.ComponentType<{ children: React.ReactNode }>;
  modal?: boolean;
};

export const SelectWithOptions = ({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  triggerClassName,
  triggerId,
  triggerWrapper,
  modal = true,
}: SelectWithOptionsProps) => {
  const trigger = (
    <SelectTrigger id={triggerId} className={cn(triggerClassName)}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );

  return (
    <Select
      value={String(value)}
      onValueChange={onValueChange}
      disabled={disabled}
      modal={modal}
    >
      {triggerWrapper
        ? React.createElement(triggerWrapper, null, trigger)
        : trigger}
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
