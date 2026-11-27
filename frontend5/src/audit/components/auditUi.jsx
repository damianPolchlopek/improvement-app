// Wspólne drobne elementy widoków audytu, w stylu pozostałych modułów
// (płaskie powierzchnie, cienkie linie, kolory z palety akcentów).
import React from 'react';
import { Box, Typography } from '@mui/material';

import { HAIRLINE, surfaceSx } from '../../tokens';
import { MACRO_COLORS, formatMacro } from '../../food/foodView/macroColors';

// Kwadratowa plakietka z ikoną w kolorze akcentu (typ rewizji, grupa zmian).
export function AccentIcon({ accent, Icon, size = 36 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: accent.bg,
        color: accent.text,
        '& svg': { fontSize: size * 0.5 },
      }}
    >
      <Icon />
    </Box>
  );
}

// Karta sekcji z nagłówkiem (ikona, tytuł, opcjonalne akcje) oddzielonym cienką linią.
export function Section({ icon, title, actions, children, sx }) {
  return (
    <Box component="section" sx={{ ...surfaceSx, ...sx }}>
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: HAIRLINE,
          }}
        >
          {icon}
          <Typography sx={{ fontWeight: 500, flex: 1, minWidth: 0 }}>{title}</Typography>
          {actions}
        </Box>
      )}
      <Box>{children}</Box>
    </Box>
  );
}

// Pusty stan: wyciszona ikona, tytuł i opis.
export function EmptyState({ Icon, title, description }) {
  return (
    <Box sx={{ ...surfaceSx, py: 6, px: 2, textAlign: 'center' }}>
      <Icon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.6, mb: 1 }} />
      <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

const MACRO_KEYS = [
  { key: 'kcal', labelKey: 'audit.calories', unit: 'kcal' },
  { key: 'protein', labelKey: 'food.protein', unit: 'g' },
  { key: 'carbohydrates', labelKey: 'food.carbs', unit: 'g' },
  { key: 'fat', labelKey: 'food.fat', unit: 'g' },
];

// Cztery kafelki makroskładników; `render(key)` zwraca zawartość pod etykietą.
export function MacroTiles({ t, render }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 1,
      }}
    >
      {MACRO_KEYS.map(({ key, labelKey, unit }) => (
        <Box key={key} sx={{ bgcolor: 'surface.subtle', borderRadius: 2, px: 1.5, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {t(labelKey)}
          </Typography>
          {render(key, unit, MACRO_COLORS[key].text)}
        </Box>
      ))}
    </Box>
  );
}

// Liczba makro w kolorze makroskładnika z jednostką.
export function MacroValue({ value, unit, color, size = 18 }) {
  return (
    <Typography
      component="span"
      sx={{ fontSize: size, fontWeight: 500, color, fontVariantNumeric: 'tabular-nums' }}
    >
      {formatMacro(value)}
      <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
        {unit}
      </Typography>
    </Typography>
  );
}

// Zwięzły zapis makro w jednej linii: "520 kcal · B 30 g · W 60 g · T 15 g".
export function MacroInline({ t, kcal, protein, carbohydrates, fat }) {
  // Brakujące wartości pomijamy zamiast pokazywać „0 g”.
  const items = [
    { key: 'protein', value: protein, label: t('food.protein') },
    { key: 'carbohydrates', value: carbohydrates, label: t('food.carbs') },
    { key: 'fat', value: fat, label: t('food.fat') },
  ].filter((item) => item.value != null);
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: 1.5,
        rowGap: 0.25,
        fontSize: 13,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {kcal != null && (
        <Box component="span" sx={{ color: MACRO_COLORS.kcal.text, fontWeight: 500 }}>
          {Math.round(kcal)} kcal
        </Box>
      )}
      {items.map(({ key, value, label }) => (
        <Box component="span" key={key} sx={{ color: 'text.secondary' }}>
          {label}{' '}
          <Box component="span" sx={{ color: MACRO_COLORS[key].text }}>
            {formatMacro(value)} g
          </Box>
        </Box>
      ))}
    </Box>
  );
}
