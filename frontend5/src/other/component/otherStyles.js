import { ACCENTS } from '../../tokens';

// Nawyki dziennika z kolorami z palety akcentów.
export const DAILY_HABITS = [
  { key: 'health', ...ACCENTS.teal },
  { key: 'exercise', ...ACCENTS.purple },
  { key: 'book', ...ACCENTS.amber },
  { key: 'software', ...ACCENTS.blue },
];

// Wiersz "dd-MM-yyyy" z API -> Date (bez pluginu dayjs do parsowania formatów).
export function parseApiDate(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(value ?? ''));
  return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : null;
}
