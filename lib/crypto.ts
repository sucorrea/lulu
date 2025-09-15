import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, 'hex'); // 32 bytes = 256 bits

function toUrlSafe(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromUrlSafe(s: string) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

export function encryptId(id: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(id, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return toUrlSafe(Buffer.concat([iv, tag, encrypted]));
}

export function decryptId(token: string) {
  const data = fromUrlSafe(token);
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return out.toString('utf8');
}
