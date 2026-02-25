import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const initFirebaseAdmin = () => {
  if (admin.apps.length) {
    return admin.app();
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      ),
    });
  }

  const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');
  if (existsSync(serviceAccountPath)) {
    return admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
      ),
    });
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
