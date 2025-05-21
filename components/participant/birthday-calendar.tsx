'use client';

import { useMemo } from 'react';
import _ from 'lodash';
import { participants } from '../lulus/mockdata';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function BirthdayCalendar() {
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      const monthA = parseInt(a.month);
      const monthB = parseInt(b.month);

      if (monthA !== monthB) {
        return monthA - monthB;
      }

      const dayA = a.date.getDate();
      const dayB = b.date.getDate();
      return dayA - dayB;
    });
  }, []);

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
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((monthNum) => ({
        number: monthNum,
        name: monthNames[parseInt(monthNum) - 1],
        participants: participantsByMonth[monthNum],
      }));
  }, [participantsByMonth]);

  return (
    <Card>
      <CardHeader className="p-2">
        <CardTitle className="text-xl  font-semibold mb-4 text-primary">
          Aniversariantes por mês
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-4 ">
          {months.map((month) => (
            <div key={month.number}>
              <div className="space-y-2 ">
                <h3 className="lulu-header text-lg">{month.name}</h3>
                <div className="space-y-1">
                  {month.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center py-1"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {participant.date.getDate()}
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
}
