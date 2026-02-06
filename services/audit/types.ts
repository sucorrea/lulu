export type AuditFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'object'
  | 'array';

export interface AuditFieldChange {
  field: string;

  oldValue: unknown;

  newValue: unknown;

  fieldType: AuditFieldType;
}

export interface AuditLogMetadata {
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLog {
  id: string;
  participantId?: number;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail?: string;
  changes: AuditFieldChange[];
  metadata?: AuditLogMetadata;
}

export type TrackedPersonFields = {
  name?: string;
  fullName?: string;
  date?: string | Date;
  city?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  pix_key?: string;
  pix_key_type?: string;
  gives_to_id?: number;
  picture?: string;
  photoURL?: string;
};
