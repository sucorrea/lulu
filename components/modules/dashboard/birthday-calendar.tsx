'use client';
import { useMemo } from 'react';

import Image from 'next/image';

import { Person } from '@/components/lulus/types';
import {
  canOptimizeImage,
  getInitials,
  getParticipantPhotoUrl,
} from '@/components/lulus/participant-photo';
import {
  getTodayKey,
  groupBirthdaysByMonthFrom,
  todayFromKey,
} from '@/components/lulus/birthday';
import { cn } from '@/lib/utils';

type BirthdayCalendarProps = {
  participants: Person[];
  todayKey?: string;
};

const BirthdayCalendar = ({
  participants,
  todayKey,
}: BirthdayCalendarProps) => {
  const groups = useMemo(
    () =>
      groupBirthdaysByMonthFrom(
        participants,
        todayFromKey(todayKey ?? getTodayKey())
      ),
    [participants, todayKey]
  );

  return (
    <section
      aria-labelledby="ano-das-lulus"
      className="lulu-card space-y-4 md:col-span-2"
    >
      <h2 id="ano-das-lulus" className="lulu-header text-xl">
        O ano das Lulus
      </h2>
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.monthIndex}
            className="grid grid-cols-[5.5rem_1fr] items-start gap-3 md:grid-cols-[8rem_1fr]"
          >
            <div className="pt-2">
              <h3 className="lulu-header text-lg md:text-2xl">{group.label}</h3>
              {group.isCurrent && (
                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                  AGORA
                </span>
              )}
            </div>
            <ul
              className={cn(
                'm-0 flex list-none flex-wrap gap-2 rounded-xl border border-border bg-card p-2',
                group.isCurrent && 'bg-surface-warm'
              )}
            >
              {group.people.map(({ person, day }) => {
                const photo = getParticipantPhotoUrl(person);
                return (
                  <li
                    key={person.id}
                    className="flex min-h-11 items-center gap-2 rounded-full bg-surface-warm py-1 pl-1 pr-3"
                  >
                    {photo ? (
                      <Image
                        src={photo}
                        alt=""
                        width={36}
                        height={36}
                        sizes="36px"
                        unoptimized={!canOptimizeImage(photo)}
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-accent"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-accent"
                      >
                        {getInitials(person.name)}
                      </span>
                    )}
                    <span className="font-serif text-xl font-bold leading-none text-primary">
                      {day}
                    </span>
                    <span className="text-sm">{person.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
export default BirthdayCalendar;
