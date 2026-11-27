import { HAIRLINE } from '../../food/component/foodStyles';

export const ROW_LINE = '1px solid rgba(255,255,255,0.06)';

// Nawyki dziennika z kolorami (spójne z paletą food/training).
export const DAILY_HABITS = [
  { key: 'health', dot: '#1D9E75', bg: '#085041', text: '#9FE1CB' },
  { key: 'exercise', dot: '#7F77DD', bg: '#3C3489', text: '#CECBF6' },
  { key: 'book', dot: '#EF9F27', bg: '#633806', text: '#FAC775' },
  { key: 'software', dot: '#378ADD', bg: '#0C447C', text: '#B5D4F4' },
];

// Spokojna tabela modułu other: cienkie linie, nagłówek 12px, treść wyśrodkowana w pionie.
export const otherTableSx = {
  '& .MuiTableCell-root': {
    px: 2,
    py: 1.1,
    verticalAlign: 'middle',
    borderBottom: ROW_LINE,
  },
  '& .MuiTableCell-head': {
    fontSize: 12,
    fontWeight: 500,
    color: 'text.secondary',
    whiteSpace: 'nowrap',
    py: 1,
    borderBottom: HAIRLINE,
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root': { borderBottom: 0 },
  '& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root': {
    bgcolor: 'rgba(255,255,255,0.02)',
  },
};

// Ciemniejsze tło pól – jak w wyszukiwarkach modułu food.
export const fieldSx = {
  '& .MuiInputBase-root, & .MuiPickersInputBase-root': { bgcolor: 'rgba(0,0,0,0.18)' },
};

// Wiersz "dd-MM-yyyy" z API -> Date (bez pluginu dayjs do parsowania formatów).
export function parseApiDate(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(value ?? ''));
  return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : null;
}
