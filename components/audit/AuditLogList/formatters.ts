import { formatDate } from '@/components/lulus/utils';

export const formatValue = (value: unknown, fieldType: string): string => {
  if (value === null || value === undefined) {
    return 'Não informado';
  }

  if (fieldType === 'date' && typeof value === 'string') {
    try {
      return formatDate(new Date(value));
    } catch {
      return String(value);
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return '[object Object]';
  }

  return String(value);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const dateFormatted = formatDate(date);
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateFormatted} às ${time}`;
};
