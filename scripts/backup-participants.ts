/**
 * Script to backup all participants from Firestore to a JSON file.
 * Run with: npx tsx scripts/backup-participants.ts
 */
import admin from 'firebase-admin';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  console.error('serviceAccountKey.json not found at', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backup() {
  const snapshot = await db.collection('participants').get();
  const participants: Record<string, unknown>[] = [];

  snapshot.forEach((doc) => {
    participants.push({ _docId: doc.id, ...doc.data() });
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `backups/participants-backup-${timestamp}.json`;

  writeFileSync(
    resolve(process.cwd(), filename),
    JSON.stringify(participants, null, 2),
    'utf-8'
  );

  console.log(`✅ Backup saved to ${filename}`);
  console.log(`📊 Total participants: ${participants.length}`);

  // Show email/authEmail/uid for debugging
  console.log('\n--- Participant lookup fields ---');
  for (const p of participants) {
    console.log(
      `  Doc ID: ${p._docId} | id: ${p.id} | name: ${p.name} | email: ${p.email ?? '(none)'} | authEmail: ${p.authEmail ?? '(none)'} | uid: ${p.uid ?? '(none)'} | role: ${p.role ?? '(none)'}`
    );
  }
}

backup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backup failed:', err);
    process.exit(1);
  });
