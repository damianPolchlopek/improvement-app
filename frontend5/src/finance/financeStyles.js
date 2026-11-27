import { calmTableSx, STATUS } from '../tokens';

export const UP_COLOR = STATUS.up;
export const DOWN_COLOR = STATUS.down;

// Spokojna tabela modułu finance: jak calmTableSx, z liczbami o stałej szerokości cyfr.
export const financeTableSx = {
  ...calmTableSx,
  '& .MuiTableCell-root': {
    ...calmTableSx['& .MuiTableCell-root'],
    fontVariantNumeric: 'tabular-nums',
  },
};
