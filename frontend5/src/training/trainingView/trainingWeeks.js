// Pomocnicze funkcje widoku treningów pogrupowanego tygodniami.
import { TRAINING_TYPES } from '../component/TrainingTypeSelector';

// Backend zapisuje w nazwie tylko kod typu (część po "-" z ExerciseType, np. "Siłowy#1-A" -> "A"):
// "412 - 24.11.2026r. - A" -> { name, number: '412', date: Date, type: 'A' }
const TRAINING_NAME_RE = /^\s*(\d+)\s*-\s*(\d{1,2})\.(\d{1,2})\.(\d{4})r?\.?\s*-\s*(.+?)\s*$/;

export function parseTrainingName(name) {
  const match = TRAINING_NAME_RE.exec(String(name ?? ''));
  if (!match) return { name, number: null, date: null, type: name };
  const [, number, day, month, year, type] = match;
  return { name, number, date: new Date(Number(year), Number(month) - 1, Number(day)), type };
}

// Grupy typów treningu: filtr w nagłówku i kolor etykiety dnia.
// `bg` / `text` – ciemne tło i jasny tekst (motyw aplikacji jest ciemny), `dot` – kropka w filtrze.
export const TYPE_GROUPS = [
  { key: 'strength', match: ['siłowy'], bg: '#3C3489', text: '#CECBF6', dot: '#7F77DD' },
  {
    key: 'hypertrophy',
    match: ['hipertroficzny'],
    bg: '#085041',
    text: '#9FE1CB',
    dot: '#1D9E75',
  },
  { key: 'fbw', match: ['fbw', '5x5'], bg: '#712B13', text: '#F5C4B3', dot: '#D85A30' },
  { key: 'kettle', match: ['kettle'], bg: '#633806', text: '#FAC775', dot: '#EF9F27' },
  { key: 'cardio', match: [], bg: '#444441', text: '#D3D1C7', dot: '#888780' },
];

// Kod typu z nazwy treningu -> grupa. Uwaga: "FBW#3-A/B" i "Siłowy#1-A/B" dają ten sam kod,
// więc "A" i "B" traktujemy jako trening siłowy.
const CODE_GROUPS = {
  A: 'strength',
  B: 'strength',
  C: 'hypertrophy',
  D: 'hypertrophy',
  F: 'fbw',
  F1: 'fbw',
  F2: 'fbw',
  F3A: 'fbw',
  F3B: 'fbw',
  K1: 'kettle',
  K2: 'kettle',
  K3: 'kettle',
  E: 'cardio',
  R: 'cardio',
};

const normalizeCode = (type) =>
  String(type ?? '')
    .trim()
    .toUpperCase();

export function typeGroup(type) {
  const byCode = CODE_GROUPS[normalizeCode(type)];
  if (byCode) return TYPE_GROUPS.find((group) => group.key === byCode);

  // Pełne nazwy (np. "Siłowy#1-A") – dopasowanie po słowie.
  const lower = String(type ?? '').toLowerCase();
  return (
    TYPE_GROUPS.find((group) => group.match.some((m) => lower.includes(m))) ??
    TYPE_GROUPS[TYPE_GROUPS.length - 1]
  );
}

// Czytelna nazwa typu: "A" -> "Siłowy A", "K1" -> "Kettle K1", "E" -> "Basen".
export function typeLabel(type) {
  const code = normalizeCode(type);
  return TRAINING_TYPES.find((entry) => entry.value === code)?.label ?? type;
}

// Poniedziałek tygodnia, do którego należy data (00:00 czasu lokalnego).
export function startOfWeek(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

// Numer tygodnia wg ISO 8601 (tydzień z pierwszym czwartkiem roku = 1).
export function isoWeek(date) {
  const thursday = startOfWeek(date);
  thursday.setDate(thursday.getDate() + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const firstWeekMonday = startOfWeek(firstThursday);
  return Math.round((thursday - firstWeekMonday) / (7 * 24 * 3600 * 1000)) + 1;
}

// Grupuje treningi (posortowane malejąco po dacie) w kolejne tygodnie.
// Treningi bez rozpoznanej daty trafiają do osobnej grupy bez nagłówka tygodnia.
export function groupByWeek(trainings) {
  const groups = [];
  for (const training of trainings) {
    const key = training.date ? startOfWeek(training.date).getTime() : 'unknown';
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.trainings.push(training);
    } else {
      const monday = training.date ? startOfWeek(training.date) : null;
      groups.push({ key, monday, trainings: [training] });
    }
  }
  return groups;
}

export const localeOf = (language) => (language === 'en' ? 'en-GB' : 'pl-PL');
