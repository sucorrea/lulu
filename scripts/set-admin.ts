import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch {
    console.error(
      'FIREBASE_SERVICE_ACCOUNT_KEY contém JSON inválido. Verifique se a variável de ambiente contém o JSON válido da service account.'
    );
    process.exit(1);
  }
} else {
  const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json');

  if (!existsSync(serviceAccountPath)) {
    console.error(
      'Erro: serviceAccountKey.json não encontrado e FIREBASE_SERVICE_ACCOUNT_KEY não está definida.'
    );
    process.exit(1);
  }

  try {
    const serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, 'utf-8')
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch {
    console.error(
      `serviceAccountKey.json contém JSON inválido. Caminho: ${serviceAccountPath}`
    );
    process.exit(1);
  }
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

try {
  await setAdminClaim(emailOrUid, !revoke);
} catch (error) {
  console.error('Erro:', (error as Error).message);
  process.exit(1);
}
