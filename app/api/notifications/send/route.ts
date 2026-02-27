import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminMessaging } from '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';

interface SendRequestBody {
  title: string;
  body: string;
  tokens: string[];
  link?: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const cronSecret = process.env.CRON_SECRET;

    const isCronCall = cronSecret && idToken === cronSecret;

    if (!isCronCall) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const callerUser = await adminAuth.getUser(decodedToken.uid);
        const callerClaims =
          (callerUser.customClaims as Record<string, unknown>) ?? {};

        if (callerClaims.admin !== true) {
          return NextResponse.json(
            { error: 'Apenas administradores podem enviar notificações' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }
    }

    const { title, body, tokens, link } =
      (await request.json()) as SendRequestBody;

    if (!title || !body || !tokens?.length) {
      return NextResponse.json(
        { error: 'title, body e tokens são obrigatórios' },
        { status: 400 }
      );
    }

    const message = {
      notification: { title, body },
      data: link ? { url: link } : undefined,
      tokens,
    };

    const response = await adminMessaging.sendEachForMulticast(message);

    const failedTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error?.code &&
        [
          'messaging/invalid-registration-token',
          'messaging/registration-token-not-registered',
        ].includes(resp.error.code)
      ) {
        failedTokens.push(tokens[idx]);
      }
    });

    if (failedTokens.length > 0) {
      const participantsSnapshot = await adminDb
        .collection('participants')
        .get();

      const batch = adminDb.batch();

      participantsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const currentTokens: string[] = data.fcmTokens ?? [];
        const cleanedTokens = currentTokens.filter(
          (t) => !failedTokens.includes(t)
        );

        if (cleanedTokens.length !== currentTokens.length) {
          batch.update(doc.ref, { fcmTokens: cleanedTokens });
        }
      });

      await batch.commit();
    }

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      cleanedTokens: failedTokens.length,
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return NextResponse.json(
      { error: 'Erro interno ao enviar notificação' },
      { status: 500 }
    );
  }
};
