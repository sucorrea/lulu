'use client';
import { useMemo } from 'react';

import _ from 'lodash';

import { Person } from '@/components/lulus/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BirthdayCalendarProps = {
  participants: Person[];
};

const BirthdayCalendar = ({ participants }: BirthdayCalendarProps) => {
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      const monthA = Number.parseInt(a.month);
      const monthB = Number.parseInt(b.month);

      if (monthA !== monthB) {
        return monthA - monthB;
      }

      const dayA = new Date(a.date).getDate();
      const dayB = new Date(b.date).getDate();
      return dayA - dayB;
    });
  }, [participants]);

  const participantsByMonth = useMemo(() => {
    return _.groupBy(sortedParticipants, 'month');
  }, [sortedParticipants]);

  const months = useMemo(() => {
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return Object.keys(participantsByMonth)
      .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
      .map((monthNum) => ({
        number: monthNum,
        name: monthNames[Number.parseInt(monthNum) - 1],
        participants: participantsByMonth[monthNum],
      }));
  }, [participantsByMonth]);

  return (
    <Card className="lulu-card">
      <CardHeader className="p-2">
        <CardTitle className="lulu-header mb-2 text-xl">
          Aniversariantes por mês
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {months.map((month) => (
            <div key={month.number}>
              <div className="space-y-2">
                <h3 className="lulu-header text-lg">{month.name}</h3>
                <div className="space-y-1">
                  {month.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center py-0.5"
                    >
                      <div className="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {new Date(participant.date).getDate() + 1}
                      </div>
                      <span className="ml-3">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>{' '}
      </CardContent>
    </Card>
  );
};
export default BirthdayCalendar;
