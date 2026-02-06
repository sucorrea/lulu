import {
  collection,
  collectionGroup,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { AuditLog, AuditFieldChange } from './types';

const generateAuditLogId = (): string => {
  const timestamp = Date.now();
  const buffer = new Uint8Array(6);

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }

  const random = Array.from(buffer)
    .map((byte) => byte.toString(36))
    .join('')
    .substring(0, 9);

  return `${timestamp}_${random}`;
};

export const createAuditLog = async (
  participantId: number,
  data: {
    userId: string;
    userName: string;
    userEmail?: string;
    changes: AuditFieldChange[];
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<AuditLog> => {
  try {
    const auditLogId = generateAuditLogId();
    const timestamp = new Date().toISOString();

    const auditLog: AuditLog = {
      id: auditLogId,
      participantId,
      timestamp,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      changes: data.changes,
      metadata: {
        source: data.source || 'web-form',
        ...(data.ipAddress && { ipAddress: data.ipAddress }),
        ...(data.userAgent && { userAgent: data.userAgent }),
      },
    };

    const auditCollectionRef = collection(
      db,
      'participants',
      String(participantId),
      'audit'
    );

    await addDoc(auditCollectionRef, auditLog);

    return auditLog;
  } catch (error) {
    console.error(
      `Erro ao criar audit log para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const getAuditLogs = async (
  participantId: number,
  limitCount: number = 10
): Promise<AuditLog[]> => {
  try {
    const auditCollectionRef = collection(
      db,
      'participants',
      String(participantId),
      'audit'
    );

    const q = query(
      auditCollectionRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const logs: AuditLog[] = [];

    querySnapshot.forEach((docSnapshot) => {
      logs.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as AuditLog);
    });

    return logs;
  } catch (error) {
    console.error(
      `Erro ao buscar audit logs para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const getAuditLogsByUser = async (
  participantId: number,
  userId: string,
  limitCount: number = 10
): Promise<AuditLog[]> => {
  try {
    const auditCollectionRef = collection(
      db,
      'participants',
      String(participantId),
      'audit'
    );

    const q = query(
      auditCollectionRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const logs: AuditLog[] = [];

    querySnapshot.forEach((docSnapshot) => {
      logs.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as AuditLog);
    });

    return logs;
  } catch (error) {
    console.error(
      `Erro ao buscar audit logs por usuário ${userId} para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const getLatestAudit = async (
  participantId: number
): Promise<AuditLog | null> => {
  try {
    const logs = await getAuditLogs(participantId, 1);
    return logs.length > 0 ? logs[0] : null;
  } catch (error) {
    console.error(
      `Erro ao buscar último audit log para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const getAuditLogsByChangedField = async (
  participantId: number,
  fieldName: string,
  limitCount: number = 10
): Promise<AuditLog[]> => {
  try {
    const auditCollectionRef = collection(
      db,
      'participants',
      String(participantId),
      'audit'
    );

    const q = query(
      auditCollectionRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount * 2)
    );

    const querySnapshot = await getDocs(q);
    const logs: AuditLog[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const log = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as AuditLog;

      if (log.changes.some((change) => change.field === fieldName)) {
        logs.push(log);
      }
    });

    return logs.slice(0, limitCount);
  } catch (error) {
    console.error(
      `Erro ao buscar audit logs por campo ${fieldName} para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const countAuditLogs = async (
  participantId: number
): Promise<number> => {
  try {
    const auditCollectionRef = collection(
      db,
      'participants',
      String(participantId),
      'audit'
    );

    const snapshot = await getDocs(auditCollectionRef);
    return snapshot.size;
  } catch (error) {
    console.error(
      `Erro ao contar audit logs para participante ${participantId}:`,
      error
    );
    throw error;
  }
};

export const getAllAuditLogs = async (
  limitCount: number = 50
): Promise<AuditLog[]> => {
  try {
    const auditGroupRef = collectionGroup(db, 'audit');

    const q = query(
      auditGroupRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const logs: AuditLog[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const pathSegments = docSnapshot.ref.path.split('/');
      const participantIdFromPath = Number(pathSegments[1]);

      logs.push({
        id: docSnapshot.id,
        ...data,
        participantId: data.participantId ?? participantIdFromPath,
      } as AuditLog);
    });

    return logs;
  } catch (error) {
    console.error('Erro ao buscar todos os audit logs:', error);
    throw error;
  }
};

export const getAllAuditLogsByUser = async (
  userId: string,
  limitCount: number = 50
): Promise<AuditLog[]> => {
  try {
    const auditGroupRef = collectionGroup(db, 'audit');

    const q = query(
      auditGroupRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const logs: AuditLog[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const pathSegments = docSnapshot.ref.path.split('/');
      const participantIdFromPath = Number(pathSegments[1]);

      logs.push({
        id: docSnapshot.id,
        ...data,
        participantId: data.participantId ?? participantIdFromPath,
      } as AuditLog);
    });

    return logs;
  } catch (error) {
    console.error(`Erro ao buscar audit logs por usuário ${userId}:`, error);
    throw error;
  }
};
