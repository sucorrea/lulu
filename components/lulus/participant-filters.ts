import { getDaysUntilBirthday } from './birthday';
import { Person } from './types';

export const SORT_UPCOMING = 'upcoming';

type AssignmentRecord = Record<
  number,
  { birthdayPersonId: number; birthdayPersonName: string }
>;

const getGivesToNameFromMap = (
  participantId: number,
  participants: Person[],
  assignmentsMap?: AssignmentRecord
): string => {
  const assignment = assignmentsMap?.[participantId];
  if (!assignment) {
    return '';
  }
  const birthdayPerson = participants.find(
    (p) => p.id === assignment.birthdayPersonId
  );
  return (birthdayPerson?.name ?? '').toLowerCase();
};

const compareByCalendarDate = (a: Person, b: Person): number =>
  Number.parseInt(a.month) * 100 +
  new Date(a.date).getUTCDate() -
  (Number.parseInt(b.month) * 100 + new Date(b.date).getUTCDate());

export const filteredAndSortedParticipantsV2 = (
  participants: Person[],
  searchTerm: string,
  filterMonth: string,
  sortBy: string,
  assignmentsMap?: AssignmentRecord,
  today?: Date
) => {
  const term = searchTerm.toLowerCase();

  return participants
    .filter((p) => {
      const givesToName = getGivesToNameFromMap(
        p.id,
        participants,
        assignmentsMap
      );
      const matchesSearch =
        p.name.toLowerCase().includes(term) || givesToName.includes(term);
      const matchesMonth = filterMonth === 'all' || p.month === filterMonth;
      return matchesSearch && matchesMonth;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return compareByCalendarDate(a, b);
        case SORT_UPCOMING:
          return (
            getDaysUntilBirthday(a.date, today) -
            getDaysUntilBirthday(b.date, today)
          );
        default:
          return 0;
      }
    });
};
