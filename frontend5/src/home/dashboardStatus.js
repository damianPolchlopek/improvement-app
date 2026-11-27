import dayjs from 'dayjs';
import { ACCENTS } from '../tokens';

// Co ile dni oczekujemy wpisu w danym module — od tego zależy, czy jest "na dziś"
export const MODULES = [
  { key: 'diet', lastField: 'lastDietDay', daysField: 'dietDays', rhythm: 1 },
  { key: 'training', lastField: 'lastTraining', daysField: 'trainingDays', rhythm: 3 },
  { key: 'daily', lastField: 'lastDaily', daysField: 'dailyDays', rhythm: 1 },
  { key: 'weekly', lastField: 'lastWeekly', daysField: 'weeklyDays', rhythm: 7 },
];

// Kolory modułów z palety akcentów: `dot` – akcent, `bg` / `text` – kafelek ikony.
export const MODULE_COLORS = {
  diet: ACCENTS.coral,
  training: ACCENTS.purple,
  daily: ACCENTS.blue,
  weekly: ACCENTS.teal,
};

export function moduleStatus(lastIso, rhythm, today = dayjs()) {
  if (!lastIso) {
    return { days: null, due: true, overdue: null, next: null };
  }
  const last = dayjs(lastIso);
  const days = today.startOf('day').diff(last, 'day');
  return {
    days,
    due: days >= rhythm,
    overdue: Math.max(days - rhythm, 0),
    next: last.add(rhythm, 'day'),
  };
}
