import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export const verifyAdminRequest = async (
  request: NextRequest
): Promise<NextResponse | null> => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }

  const callerUser = await adminAuth.getUser(decodedToken.uid);
  const callerClaims =
    (callerUser.customClaims as Record<string, unknown>) ?? {};
  if (callerClaims.admin !== true) {
    return NextResponse.json(
      { error: 'Acesso restrito a administradores' },
      { status: 403 }
    );
  }

  return null;
};
