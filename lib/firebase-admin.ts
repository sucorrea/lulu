import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const initFirebaseAdmin = () => {
  if (admin.apps.length) {
    return admin.app();
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      );
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY contains invalid JSON. Ensure the environment variable holds valid service account JSON.'
      );
    }
  }

  const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');
  if (existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(
        readFileSync(serviceAccountPath, 'utf-8')
      );
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch {
      throw new Error(
        `serviceAccountKey.json contains invalid JSON. Path: ${serviceAccountPath}`
      );
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is required in production. Set the environment variable with the service account JSON.'
    );
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
};

const app = initFirebaseAdmin();

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
