// Style tabel modułu food (ciemny motyw aplikacji). Kolory i powierzchnie – w src/tokens.js.
import { HAIRLINE, ROW_LINE } from '../../tokens';

// Nadpisuje StyledTableCell/StyledTableRow (czarny nagłówek, paski) na spokojną tabelę.
// Podwójne klasy podbijają specyficzność ponad style z `styled()`.
export const foodTableSx = {
  '& .MuiTableCell-root.MuiTableCell-head': {
    bgcolor: 'transparent',
    color: 'text.secondary',
    fontSize: 12,
    fontWeight: 500,
    borderBottom: HAIRLINE,
    whiteSpace: 'nowrap',
  },
  '& .MuiTableCell-root.MuiTableCell-body': {
    borderBottom: ROW_LINE,
  },
  '& .MuiTableRow-root.MuiTableRow-root:nth-of-type(odd)': {
    bgcolor: 'transparent',
  },
  '& .MuiTableRow-root.MuiTableRow-root.Mui-selected': {
    bgcolor: 'primaryTint.selected',
  },
};
