'use client';

import { useMemo } from 'react';
import _ from 'lodash';
import { participants } from '../lulus/mockdata';

export function BirthdayCalendar() {
  const sortedParticipants = useMemo(() => {
    // Create a copy to avoid mutating the original data
    return [...participants].sort((a, b) => {
      // Sort by month number first
      const monthA = parseInt(a.month);
      const monthB = parseInt(b.month);

      if (monthA !== monthB) {
        return monthA - monthB;
      }

      // If months are the same, sort by day
      const dayA = a.date.getDate();
      const dayB = b.date.getDate();
      return dayA - dayB;
    });
  }, []);

  // Group by month
  const participantsByMonth = useMemo(() => {
    return _.groupBy(sortedParticipants, 'month');
  }, [sortedParticipants]);

  // Get month names for display
  const months = useMemo(() => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
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
    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
      {months.map((month) => (
        <div key={month.number} className="space-y-2">
          <h3 className="lulu-header text-lg">{month.name}</h3>
          <div className="space-y-1">
            {month.participants.map((participant) => (
              <div key={participant.id} className="flex items-center py-1">
                <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  {participant.date.getDate()}
                </div>
                <span className="ml-3">{participant.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
