// Tokeny wyglądu aplikacji (ciemny motyw): jedno źródło kolorów, powierzchni i linii.
// `theme.js` wpina je do palety MUI (np. `bgcolor: 'surface.field'`, `color: 'status.up'`
// w `sx`), a stałe poniżej służą tam, gdzie potrzebny jest gotowy string (ramki, recharts).

// Czcionka interfejsu: Arial (Helvetica tam, gdzie Ariala brak). Musi się zgadzać z index.css.
export const FONT_FAMILY = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

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

// Kolory serii na wykresach (kategoryczne), w stałej kolejności – nigdy nie zapętlane, więc
// wykres pokazuje najwyżej CHART_SERIES.length serii. Kolejność zwalidowana skryptem dataviz
// na tle karty (SURFACE.card #213748): jasność w paśmie L 0.48–0.67, kontrast ≥ 3:1, sąsiednie pary
// rozróżnialne przy daltonizmie (ΔE ≥ 9.0) i normalnym widzeniu (ΔE ≥ 18.6).
// Zmieniając kolory lub kolejność – zwaliduj ponownie.
export const CHART_SERIES = [
  ACCENTS.blue.dot,
  ACCENTS.coral.dot,
  ACCENTS.teal.dot,
  '#C98500', // ciemniejszy amber – ACCENTS.amber.dot jest za jasny na wykres
  '#D4537E', // magenta
  '#0CA30C', // zieleń
  ACCENTS.purple.dot,
  '#E66767', // czerwień
];

// Linie pomocnicze wykresów: siatka i osie mają być ciche.
export const CHART_LINES = {
  grid: 'rgba(255,255,255,0.08)',
  axis: 'rgba(255,255,255,0.16)',
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
// Strona i karty mają pełne (nieprzezroczyste) kolory: płaski granat (odcień ze środka
// dawnego gradientu) pod spodem, karty o stopień jaśniejsze, kafle jeszcze o stopień.
export const SURFACE = {
  page: '#1a2d3d', // tło strony (body)
  card: '#213748', // karta sekcji / tabeli, Paper (menu, szuflada)
  tile: '#253c4e', // kafel w siatce (posiłek, moduł na Home)
  sticky: '#213748', // tło przyklejonej kolumny w karcie (= card)
  overlay: '#1d3242', // panel nakładany na treść
  dialog: '#1d3242', // dialog, tooltip wykresu
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
