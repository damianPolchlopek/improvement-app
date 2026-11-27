import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box, ThemeProvider } from '@mui/material';

import theme from './theme';
import { ACCENTS, LINE_COLOR, STATUS, SURFACE } from './tokens';

// Komponenty odwołują się do tokenów ścieżką palety w `sx` (np. bgcolor: 'surface.field').
// Gdyby MUI nie rozwiązało ścieżki, wstawiłoby ją dosłownie i kolor by zniknął.
function swatch(sx) {
  render(
    <ThemeProvider theme={theme}>
      <Box data-testid="swatch" sx={sx} />
    </ThemeProvider>
  );
  return getComputedStyle(screen.getByTestId('swatch'));
}

// Sprowadza kolor do zapisu, w jakim przeglądarka zwraca styl (hex -> rgb()).
function normalize(property, value) {
  const element = document.createElement('div');
  element.style[property] = value;
  return element.style[property];
}

describe('theme tokens', () => {
  it.each([
    ['surface.field', SURFACE.field],
    ['surface.tile', SURFACE.tile],
    ['primaryTint.strong', 'rgba(93, 202, 165, 0.16)'],
    ['toolbar.accentHover', 'rgba(93, 202, 165, 0.1)'],
  ])('resolves bgcolor %s', (path, expected) => {
    expect(swatch({ bgcolor: path }).backgroundColor).toBe(normalize('backgroundColor', expected));
  });

  it.each([
    ['status.done', STATUS.done],
    ['status.down', STATUS.down],
    ['accent.coral.light', ACCENTS.coral.light],
  ])('resolves color %s', (path, expected) => {
    expect(swatch({ color: path }).color).toBe(normalize('color', expected));
  });

  it('resolves borderColor line.hairline', () => {
    expect(swatch({ border: '1px solid', borderColor: 'line.hairline' }).borderTopColor).toBe(
      normalize('borderTopColor', LINE_COLOR.hairline)
    );
  });
});
