import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * POST /api/admin/set-claim
 * Concede ou revoga a claim admin de um usuário.
 *
 * Body: { targetUid: string, admin?: boolean }
 * - admin omitido ou true  → concede
 * - admin: false           → revoga
 */
export const POST = async (request: NextRequest) => {
  try {
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

    if (!decodedToken.admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem alterar o acesso admin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const targetUid: string = body.targetUid;
    const grantAdmin: boolean = body.admin !== false;

    if (!targetUid) {
      return NextResponse.json(
        { error: 'targetUid é obrigatório' },
        { status: 400 }
      );
    }

    let targetUser;
    try {
      targetUser = await adminAuth.getUser(targetUid);
    } catch {
      return NextResponse.json(
        { error: `Usuário com UID '${targetUid}' não encontrado` },
        { status: 404 }
      );
    }

    const existingClaims =
      (targetUser.customClaims as Record<string, unknown>) ?? {};
    await adminAuth.setCustomUserClaims(targetUid, {
      ...existingClaims,
      admin: grantAdmin,
    });

    return NextResponse.json({
      success: true,
      uid: targetUid,
      admin: grantAdmin,
    });
  } catch (error) {
    console.error('Erro ao definir claim admin:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar requisição' },
      { status: 500 }
    );
  }
};
