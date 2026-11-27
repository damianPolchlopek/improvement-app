// Tokeny wyglądu aplikacji (ciemny motyw): jedno źródło kolorów, powierzchni i linii.
// `theme.js` wpina je do palety MUI (np. `bgcolor: 'surface.field'`, `color: 'status.up'`
// w `sx`), a stałe poniżej służą tam, gdzie potrzebny jest gotowy string (ramki, recharts).

// Czcionka interfejsu: Arial (Helvetica tam, gdzie Ariala brak). Musi się zgadzać z index.css.
export const FONT_FAMILY = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

// Rodziny barw akcentów. `dot` – kropka / wypełnienie paska, `bg` – ciemne tło kafelka lub
// etykiety, `text` – jasny tekst na `bg`, `light` – średnio jasny odcień do liczb na ciemnym tle.
// ZASADA: teal, amber i red to barwy STANÓW (patrz STATUS) – nie używamy ich dla modułów
// ani kategorii. Kategorie biorą coral, purple, blue, pink, green i gray.
// Wyjątek: makroskładniki w module food (macroColors.js) zostają przy swoich kolorach.
export const ACCENTS = {
  coral: { dot: '#D85A30', bg: '#712B13', text: '#F5C4B3', light: '#F0997B' },
  purple: { dot: '#7F77DD', bg: '#3C3489', text: '#CECBF6', light: '#AFA9EC' },
  blue: { dot: '#378ADD', bg: '#0C447C', text: '#B5D4F4', light: '#85B7EB' },
  teal: { dot: '#1D9E75', bg: '#085041', text: '#9FE1CB', light: '#5DCAA5' },
  amber: { dot: '#EF9F27', bg: '#633806', text: '#FAC775', light: '#FAC775' },
  pink: { dot: '#D4537E', bg: '#72243E', text: '#F4C0D1', light: '#ED93B1' },
  green: { dot: '#639922', bg: '#27500A', text: '#C0DD97', light: '#97C459' },
  red: { dot: '#E24B4A', bg: '#791F1F', text: '#F7C1C1', light: '#F09595' },
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

// Kolory stanów (zarezerwowane): teal = zrobione / wzrost / dodano, amber = zaległe / uwaga,
// red = spadek / usunięto.
export const STATUS = {
  up: ACCENTS.teal.light,
  down: ACCENTS.red.light,
  done: ACCENTS.teal.light,
  due: ACCENTS.amber.light,
  dueBorder: 'rgba(239, 159, 39, 0.35)',
  doneBg: 'rgba(29, 158, 117, 0.18)',
};

// Tło strony (body): oryginalny gradient radialny aplikacji.
export const PAGE_BACKGROUND = 'radial-gradient(#123146, #202c34)';

// Powierzchnie, od najniższej do najwyżej położonej.
// Tło strony: oryginalny gradient radialny (granat w środku, grafit na brzegach) – patrz
// PAGE_BACKGROUND. Karty mają pełny kolor, kafle – ciemny, lekko przezroczysty.
export const SURFACE = {
  page: '#1a2d3d', // jednolity zamiennik tła tam, gdzie potrzebny jest pojedynczy kolor
  card: '#213748', // karta sekcji / tabeli, Paper (menu, szuflada)
  tile: '#213748', // kafel w siatce (posiłek, moduł na Home) – ten sam kolor co nagłówek strony (= card)
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
