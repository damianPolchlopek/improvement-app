import dayjs from 'dayjs';

// Co ile dni oczekujemy wpisu w danym module — od tego zależy, czy jest "na dziś"
export const MODULES = [
  { key: 'diet', lastField: 'lastDietDay', daysField: 'dietDays', rhythm: 1 },
  { key: 'training', lastField: 'lastTraining', daysField: 'trainingDays', rhythm: 3 },
  { key: 'daily', lastField: 'lastDaily', daysField: 'dailyDays', rhythm: 1 },
  { key: 'weekly', lastField: 'lastWeekly', daysField: 'weeklyDays', rhythm: 7 },
];

// Kolory modułów (spójne z paletą food/training): `dot` – akcent, `bg` / `text` – kafelek ikony.
export const MODULE_COLORS = {
  diet: { dot: '#D85A30', bg: '#712B13', text: '#F5C4B3' },
  training: { dot: '#7F77DD', bg: '#3C3489', text: '#CECBF6' },
  daily: { dot: '#378ADD', bg: '#0C447C', text: '#B5D4F4' },
  weekly: { dot: '#1D9E75', bg: '#085041', text: '#9FE1CB' },
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
