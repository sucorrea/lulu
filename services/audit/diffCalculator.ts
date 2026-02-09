import { Person } from '@/components/lulus/types';
import { AuditFieldChange, TrackedPersonFields } from './types';

const EXCLUDED_FIELDS = new Set(['id', 'month', 'gives_to', 'photoUpdatedAt']);

const TRACKED_FIELDS: Set<keyof TrackedPersonFields> = new Set([
  'name',
  'fullName',
  'date',
  'city',
  'email',
  'phone',
  'instagram',
  'pix_key',
  'pix_key_type',
  'gives_to_id',
  'picture',
  'photoURL',
]);

const normalizeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (dateRegex.test(value)) {
      try {
        return new Date(value).toISOString();
      } catch {
        return value;
      }
    }
  }
  return value;
};

const getFieldType = (
  value: unknown
): 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array' => {
  if (value === null) {
    return 'object';
  }
  if (value instanceof Date) {
    return 'date';
  }

  if (typeof value === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (dateRegex.test(value)) {
      return 'date';
    }
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  if (typeof value === 'object') {
    return 'object';
  }
  return typeof value as 'string' | 'number' | 'boolean';
};

export const calculateDiff = (
  oldData: Partial<Person> | null | undefined,
  newData: Partial<Person>
): AuditFieldChange[] => {
  const changes: AuditFieldChange[] = [];
  const previousData = oldData || {};

  for (const field of TRACKED_FIELDS) {
    if (EXCLUDED_FIELDS.has(field)) {
      continue;
    }

    if (!(field in newData)) {
      continue;
    }

    const oldValue = previousData[field as keyof Person];
    const newValue = newData[field as keyof Person];

    const normalizedOld = normalizeValue(oldValue);
    const normalizedNew = normalizeValue(newValue);

    const hasChanged =
      typeof normalizedOld === 'object' &&
      typeof normalizedNew === 'object' &&
      normalizedOld !== null &&
      normalizedNew !== null
        ? JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)
        : normalizedOld !== normalizedNew;

    if (hasChanged) {
      changes.push({
        field,
        oldValue: normalizedOld,
        newValue: normalizedNew,
        fieldType: getFieldType(normalizedNew ?? normalizedOld),
      });
    }
  }

  return changes;
};

export const hasChanges = (changes: AuditFieldChange[]): boolean => {
  return changes.length > 0;
};

const valueToString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '(vazio)';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

export const describeChanges = (changes: AuditFieldChange[]): string => {
  if (changes.length === 0) {
    return 'Nenhuma mudança detectada';
  }

  const descriptions = changes.map((change) => {
    const oldStr = valueToString(change.oldValue);
    const newStr = valueToString(change.newValue);
    return `${change.field}: ${oldStr} → ${newStr}`;
  });

  return descriptions.join('; ');
};
