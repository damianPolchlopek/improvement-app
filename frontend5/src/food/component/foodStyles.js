// Wspólne style widoków modułu food (ciemny motyw aplikacji).

export const SURFACE_BG = 'rgba(29, 42, 51, 0.6)';
export const HAIRLINE = '1px solid rgba(255,255,255,0.08)';

// Płaska karta-powierzchnia: jedno tło, cienka ramka, bez gradientów i cieni.
export const surfaceSx = {
  borderRadius: 3,
  bgcolor: SURFACE_BG,
  border: HAIRLINE,
  overflow: 'hidden',
};

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
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  '& .MuiTableRow-root.MuiTableRow-root:nth-of-type(odd)': {
    bgcolor: 'transparent',
  },
  '& .MuiTableRow-root.MuiTableRow-root.Mui-selected': {
    bgcolor: 'rgba(144, 202, 249, 0.08)',
  },
};
