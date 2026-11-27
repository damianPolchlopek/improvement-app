import { CHART_SERIES } from '../../tokens';

// Maksymalna liczba serii na wykresie – tyle, ile kolorów w palecie (bez zapętlania).
export const MAX_SERIES = CHART_SERIES.length;

// Kolor podąża za ćwiczeniem, nie za jego pozycją: ćwiczenia, które już miały kolor, go
// zachowują, a nowe dostają pierwszy wolny kolor z palety. Usunięcie jednego ćwiczenia nie
// przemalowuje pozostałych. Zakłada `names.length <= MAX_SERIES`.
export function assignSeriesColors(previous, names) {
  const colors = {};
  const used = new Set();
  names.forEach((name) => {
    if (previous[name]) {
      colors[name] = previous[name];
      used.add(previous[name]);
    }
  });
  names.forEach((name) => {
    if (!colors[name]) {
      const free = CHART_SERIES.find((color) => !used.has(color));
      colors[name] = free;
      used.add(free);
    }
  });
  return colors;
}
