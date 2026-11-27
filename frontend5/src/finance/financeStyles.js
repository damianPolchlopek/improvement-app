import { HAIRLINE } from '../food/component/foodStyles';

export const ROW_LINE = '1px solid rgba(255,255,255,0.06)';
export const UP_COLOR = '#5DCAA5';
export const DOWN_COLOR = '#F09595';

// Spokojna tabela modułu finance: cienkie linie, nagłówek 12px, liczby wyrównane.
export const financeTableSx = {
  '& .MuiTableCell-root': {
    px: 2,
    py: 1.1,
    verticalAlign: 'middle',
    borderBottom: ROW_LINE,
    fontVariantNumeric: 'tabular-nums',
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
