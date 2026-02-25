import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    ),
  });
} else {
  const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');

  if (!existsSync(serviceAccountPath)) {
    console.error(
      'Erro: serviceAccountKey.json não encontrado e FIREBASE_SERVICE_ACCOUNT_KEY não está definida.'
    );
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const setAdminClaim = async (emailOrUid: string, grant = true) => {
  const auth = admin.auth();

  let uid = emailOrUid;

  if (emailOrUid.includes('@')) {
    const user = await auth.getUserByEmail(emailOrUid);
    uid = user.uid;
    console.log(
      `Usuário encontrado: ${user.displayName ?? user.email} (${uid})`
    );
  }

  const existingUser = await auth.getUser(uid);
  const existingClaims =
    (existingUser.customClaims as Record<string, unknown>) ?? {};

  await auth.setCustomUserClaims(uid, { ...existingClaims, admin: grant });

  const action = grant ? 'concedida' : 'revogada';
  console.log(`✅ Claim admin ${action} com sucesso para UID: ${uid}`);
  console.log(
    'Faça logout e login novamente para que as claims entrem em vigor.'
  );
};

const emailOrUid = process.argv[2];
const revoke = process.argv[3] === '--revoke';

if (!emailOrUid) {
  console.error(
    'Uso: npx ts-node scripts/set-admin.ts <email-ou-uid> [--revoke]'
  );
  process.exit(1);
}

setAdminClaim(emailOrUid, !revoke).catch((error: Error) => {
  console.error('Erro:', error.message);
  process.exit(1);
});
