import { HAIRLINE } from '../../food/component/foodStyles';

export const ROW_LINE = '1px solid rgba(255,255,255,0.06)';

// Spokojna tabela modułu training: cienkie linie, nagłówek 12px, treść wyśrodkowana w pionie.
export const trainingTableSx = {
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

export const DATE_FORMAT = { day: '2-digit', month: '2-digit', year: 'numeric' };
