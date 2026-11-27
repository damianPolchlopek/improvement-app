// Tokeny wyglądu aplikacji (ciemny motyw): jedno źródło kolorów, powierzchni i linii.
// `theme.js` wpina je do palety MUI (np. `bgcolor: 'surface.field'`, `color: 'status.up'`
// w `sx`), a stałe poniżej służą tam, gdzie potrzebny jest gotowy string (ramki, recharts).

// Rodziny barw akcentów. `dot` – kropka / wypełnienie paska, `bg` – ciemne tło kafelka lub
// etykiety, `text` – jasny tekst na `bg`, `light` – średnio jasny odcień do liczb na ciemnym tle.
export const ACCENTS = {
  coral: { dot: '#D85A30', bg: '#712B13', text: '#F5C4B3', light: '#F0997B' },
  purple: { dot: '#7F77DD', bg: '#3C3489', text: '#CECBF6', light: '#AFA9EC' },
  blue: { dot: '#378ADD', bg: '#0C447C', text: '#B5D4F4', light: '#85B7EB' },
  teal: { dot: '#1D9E75', bg: '#085041', text: '#9FE1CB', light: '#5DCAA5' },
  amber: { dot: '#EF9F27', bg: '#633806', text: '#FAC775', light: '#FAC775' },
  gray: { dot: '#888780', bg: '#444441', text: '#D3D1C7', light: '#B4B2A9' },
};

// Kolory znaczeniowe: wzrost / spadek, wykonane / zaległe.
export const STATUS = {
  up: ACCENTS.teal.light,
  down: '#F09595',
  done: ACCENTS.teal.light,
  due: ACCENTS.amber.light,
  dueBorder: 'rgba(239, 159, 39, 0.35)',
  doneBg: 'rgba(29, 158, 117, 0.18)',
};

// Powierzchnie, od najniższej do najwyżej położonej.
export const SURFACE = {
  card: 'rgba(29, 42, 51, 0.6)', // karta sekcji / tabeli
  tile: 'rgba(29, 42, 51, 0.9)', // kafel w siatce (posiłek, moduł na Home)
  sticky: '#1c2a33', // nieprzezroczyste tło przyklejonej kolumny
  overlay: 'rgba(23, 37, 47, 0.95)', // panel nakładany na treść
  dialog: '#17252f', // dialog, tooltip wykresu
  field: 'rgba(0,0,0,0.18)', // tło pól formularzy
  inset: 'rgba(0,0,0,0.15)', // wpuszczony blok wewnątrz karty
  subtle: 'rgba(255,255,255,0.04)', // kafelek statystyki
  chip: 'rgba(255,255,255,0.06)', // neutralna pigułka / plakietka
  hover: 'rgba(255,255,255,0.02)', // najechanie na wiersz tabeli
  hoverStrong: 'rgba(255,255,255,0.03)', // najechanie na rozwijany wiersz
  track: 'rgba(255,255,255,0.08)', // tło paska postępu, nieaktywna kropka
};

// Kolory linii i gotowe ramki.
export const LINE_COLOR = {
  hairline: 'rgba(255,255,255,0.08)',
  row: 'rgba(255,255,255,0.06)',
  strong: 'rgba(255,255,255,0.16)',
  hover: 'rgba(255,255,255,0.22)',
};
export const HAIRLINE = `1px solid ${LINE_COLOR.hairline}`;
export const ROW_LINE = `1px solid ${LINE_COLOR.row}`;

// Płaska karta-powierzchnia: jedno tło, cienka ramka, bez gradientów i cieni.
export const surfaceSx = {
  borderRadius: 3,
  bgcolor: SURFACE.card,
  border: HAIRLINE,
  overflow: 'hidden',
};

// Tło dialogu (Paper) w stylu kart.
export const dialogPaperSx = {
  borderRadius: 3,
  bgcolor: SURFACE.dialog,
  backgroundImage: 'none',
  border: HAIRLINE,
};

// Ciemniejsze tło pól tekstowych i pickerów dat.
export const fieldSx = {
  '& .MuiInputBase-root, & .MuiPickersInputBase-root': { bgcolor: SURFACE.field },
};

// Spokojna tabela: cienkie linie, nagłówek 12px, treść wyśrodkowana w pionie.
export const calmTableSx = {
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
    bgcolor: SURFACE.hover,
  },
};
