import { describe, it, expect } from 'vitest';

import { CHART_SERIES } from '../../tokens';
import { MAX_SERIES, assignSeriesColors } from './seriesColors';

describe('assignSeriesColors', () => {
  it('gives new exercises the palette colors in fixed order', () => {
    expect(assignSeriesColors({}, ['Przysiad', 'Wyciskanie'])).toEqual({
      Przysiad: CHART_SERIES[0],
      Wyciskanie: CHART_SERIES[1],
    });
  });

  it('keeps colors of remaining exercises when one is removed', () => {
    const first = assignSeriesColors({}, ['Przysiad', 'Wyciskanie', 'Martwy ciąg']);
    const second = assignSeriesColors(first, ['Wyciskanie', 'Martwy ciąg']);
    expect(second).toEqual({
      Wyciskanie: first.Wyciskanie,
      'Martwy ciąg': first['Martwy ciąg'],
    });
  });

  it('reuses the first free color for a newly added exercise', () => {
    const first = assignSeriesColors({}, ['Przysiad', 'Wyciskanie']);
    const second = assignSeriesColors(first, ['Wyciskanie', 'Podciąganie']);
    expect(second.Wyciskanie).toBe(CHART_SERIES[1]);
    expect(second['Podciąganie']).toBe(CHART_SERIES[0]);
  });

  it('never repeats a color within the series limit', () => {
    const names = Array.from({ length: MAX_SERIES }, (_, i) => `Ćwiczenie ${i}`);
    const colors = Object.values(assignSeriesColors({}, names));
    expect(new Set(colors).size).toBe(MAX_SERIES);
  });
});

describe('CHART_SERIES', () => {
  it('holds distinct 6-digit hex colors', () => {
    CHART_SERIES.forEach((color) => expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/));
    expect(new Set(CHART_SERIES.map((c) => c.toLowerCase())).size).toBe(CHART_SERIES.length);
  });
});
