/**
 * Quick script to fix Sueli's email from .com.br to .com in Firestore.
 * Run with: npx tsx scripts/fix-sueli-email.ts
 */
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fix() {
  const docRef = db.collection('participants').doc('4');
  const doc = await docRef.get();

  if (!doc.exists) {
    console.error('Document 4 not found!');
    process.exit(1);
  }

  const data = doc.data()!;
  console.log(`Current email: ${data.email}`);

  await docRef.update({
    email: 'oliver.sueli@gmail.com',
  });

  console.log('✅ Email updated to: oliver.sueli@gmail.com');
}

fix()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
