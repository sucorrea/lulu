import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';

const CRON_SECRET = process.env.CRON_SECRET;

const isBirthdayMatch = (
  dateStr: string,
  targetMonth: number,
  targetDay: number
): boolean => {
  try {
    const date = new Date(dateStr);
    return date.getMonth() === targetMonth && date.getDate() === targetDay;
  } catch {
    return false;
  }
};

const getAllTokensExcept = (
  participants: FirebaseFirestore.DocumentData[],
  excludeId?: number
): string[] => {
  const tokens: string[] = [];
  participants.forEach((p) => {
    if (p.id !== excludeId && p.fcmTokens?.length) {
      tokens.push(...p.fcmTokens);
    }
  });
  return tokens;
};

const sendBatchNotification = async (
  tokens: string[],
  title: string,
  body: string,
  link?: string
) => {
  if (!tokens.length) {
    return;
  }

  const batchSize = 500;
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    await adminMessaging.sendEachForMulticast({
      notification: { title, body },
      data: link ? { url: link } : undefined,
      tokens: batch,
    });
  }
};

const formatDay = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

export const GET = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');

    if (!CRON_SECRET) {
      return NextResponse.json(
        { error: 'CRON_SECRET não configurado' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const now = new Date();
    const todayMonth = now.getMonth();
    const todayDay = now.getDate();

    const fiveDaysLater = new Date(now);
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
    const futureMonth = fiveDaysLater.getMonth();
    const futureDay = fiveDaysLater.getDate();

    const participantsSnapshot = await adminDb.collection('participants').get();

    const participants = participantsSnapshot.docs.map((d) => d.data());

    let notificationsSent = 0;

    for (const participant of participants) {
      const dateStr =
        typeof participant.date === 'string' ? participant.date : '';

      if (!dateStr) {
        continue;
      }

      const isBirthdayToday = isBirthdayMatch(dateStr, todayMonth, todayDay);
      const isBirthdayIn5Days = isBirthdayMatch(
        dateStr,
        futureMonth,
        futureDay
      );

      if (isBirthdayToday) {
        const othersTokens = getAllTokensExcept(participants, participant.id);
        await sendBatchNotification(
          othersTokens,
          `🎂 Hoje é aniversário da ${participant.name}!`,
          `Parabéns para ${participant.name}! Não esqueça de dar os parabéns! 🎉`,
          '/'
        );

        const birthdayPersonTokens: string[] = participant.fcmTokens ?? [];
        if (birthdayPersonTokens.length) {
          await sendBatchNotification(
            birthdayPersonTokens,
            `🎉 Feliz aniversário, ${participant.name}!`,
            'Todas as lulus desejam um dia maravilhoso para você! 💕',
            '/'
          );
        }

        notificationsSent++;
      }

      if (isBirthdayIn5Days) {
        const birthdayDate = formatDay(fiveDaysLater);

        const othersTokens = getAllTokensExcept(participants, participant.id);
        await sendBatchNotification(
          othersTokens,
          `🎁 O aniversário da ${participant.name} está chegando!`,
          `Faltam 5 dias! Aniversário dia ${birthdayDate}. Já pensou no presente? 🎁`,
          '/'
        );

        notificationsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      participantsChecked: participants.length,
      date: now.toISOString(),
    });
  } catch (error) {
    console.error('Erro no cron de aniversários:', error);
    return NextResponse.json(
      { error: 'Erro interno no cron de aniversários' },
      { status: 500 }
    );
  }
};
