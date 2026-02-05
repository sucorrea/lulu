import { describe, it, expect, vi } from 'vitest';

vi.unmock('@/services/firebase');

import app, { auth, db, storage } from './firebase';

describe('firebase', () => {
  it('should export app as default', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('object');
  });

  it('should export auth instance', () => {
    expect(auth).toBeDefined();
    expect(typeof auth).toBe('object');
  });

  it('should export db instance', () => {
    expect(db).toBeDefined();
    expect(typeof db).toBe('object');
  });

  it('should export storage instance', () => {
    expect(storage).toBeDefined();
    expect(typeof storage).toBe('object');
  });

  it('should have app as object instance', () => {
    expect(app).toEqual(expect.any(Object));
  });

  it('should have auth with instance properties', () => {
    expect(auth).toEqual(expect.any(Object));
  });

  it('should have db with instance properties', () => {
    expect(db).toEqual(expect.any(Object));
  });

  it('should have storage with instance properties', () => {
    expect(storage).toEqual(expect.any(Object));
  });

  it('should have firebaseConfig environment variables defined', () => {
    expect(process.env.NEXT_PUBLIC_FIREBASE_API_KEY).toBeDefined();
    expect(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).toBeDefined();
    expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_FIREBASE_APP_ID).toBeDefined();
  });

  it('should have environment variable for API key as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY).toBe('string');
  });

  it('should have environment variable for auth domain as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).toBe('string');
  });

  it('should have environment variable for project ID as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBe('string');
  });

  it('should have environment variable for storage bucket as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).toBe(
      'string'
    );
  });

  it('should have environment variable for messaging sender ID as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).toBe(
      'string'
    );
  });

  it('should have environment variable for app ID as string', () => {
    expect(typeof process.env.NEXT_PUBLIC_FIREBASE_APP_ID).toBe('string');
  });
});
