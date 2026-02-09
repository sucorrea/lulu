import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, 'hex');

const toUrlSafe = (buf: Buffer) => {
  return buf
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
};

const fromUrlSafe = (s: string) => {
  s = s.replaceAll('-', '+').replaceAll('_', '/');
  while (s.length % 4) {
    s += '=';
  }
  return Buffer.from(s, 'base64');
};

export const encryptId = (id: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(id, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return toUrlSafe(Buffer.concat([iv, tag, encrypted]));
};

export const decryptId = (token: string) => {
  const data = fromUrlSafe(token);
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return out.toString('utf8');
};
