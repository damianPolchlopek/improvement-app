import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MACRO_COLORS, formatMacro } from './macroColors';

// Pasek pokazujący proporcje gramów białka, węglowodanów i tłuszczu (bez przeliczania na kcal).
export default function MacroBar({ protein, carbohydrates, fat, height = 6 }) {
  const { t } = useTranslation();

  const parts = [
    { key: 'protein', label: t('food.protein'), grams: Math.max(Number(protein) || 0, 0) },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      grams: Math.max(Number(carbohydrates) || 0, 0),
    },
    { key: 'fat', label: t('food.fat'), grams: Math.max(Number(fat) || 0, 0) },
  ];
  const total = parts.reduce((sum, part) => sum + part.grams, 0);

  const tooltip = total
    ? parts
        .map(
          (part) =>
            `${part.label} ${formatMacro(part.grams)} g (${Math.round((part.grams / total) * 100)}%)`
        )
        .join(' · ')
    : '';

  return (
    <Tooltip title={tooltip} placement="top" arrow disableHoverListener={!total}>
      <Box
        role="img"
        aria-label={tooltip || t('food.macroShare')}
        sx={{
          display: 'flex',
          height,
          borderRadius: height / 2,
          overflow: 'hidden',
          bgcolor: 'surface.track',
          gap: '2px',
        }}
      >
        {total > 0 &&
          parts.map((part) => (
            <Box
              key={part.key}
              sx={{
                width: `${(part.grams / total) * 100}%`,
                bgcolor: MACRO_COLORS[part.key].bar,
              }}
            />
          ))}
      </Box>
    </Tooltip>
  );
}
