'use server';

import admin from 'firebase-admin';

import { adminDb } from '@/lib/firebase-admin';

export const incrementSiteVisits = async () => {
  const ref = adminDb.collection('stats').doc('site_visits');
  await ref.set(
    { count: admin.firestore.FieldValue.increment(1) },
    { merge: true }
  );
};
