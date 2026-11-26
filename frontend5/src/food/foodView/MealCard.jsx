import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MacroBar from './MacroBar';
import { MACRO_COLORS, formatMacro } from './macroColors';

export default function MealCard({ meal, selected, onSelect }) {
  const { t } = useTranslation();

  const typeLabel = meal.type ? t(`food.mealTypes.${meal.type}`, { defaultValue: meal.type }) : '';

  const macros = [
    { key: 'protein', short: t('food.proteinShort'), value: meal.protein },
    { key: 'carbohydrates', short: t('food.carbsShort'), value: meal.carbohydrates },
    { key: 'fat', short: t('food.fatShort'), value: meal.fat },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2.5,
        bgcolor: 'rgba(29, 42, 51, 0.9)',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'rgba(255,255,255,0.08)',
        transition: 'border-color 150ms, transform 150ms',
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'rgba(255,255,255,0.22)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea
        onClick={() => onSelect(meal)}
        aria-expanded={!!selected}
        sx={{
          height: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', minHeight: 18 }}>
          {typeLabel}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.3,
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}
        >
          {meal.name}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 1 }}>
            <Typography
              component="span"
              sx={{ fontSize: 26, fontWeight: 500, lineHeight: 1, color: MACRO_COLORS.kcal.text }}
            >
              {Math.round(meal.kcal)}
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              kcal
            </Typography>
          </Box>

          <MacroBar protein={meal.protein} carbohydrates={meal.carbohydrates} fat={meal.fat} />

          <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
            {macros.map((macro) => (
              <Typography key={macro.key} variant="body2" sx={{ color: 'text.secondary' }}>
                {macro.short}{' '}
                <Box component="span" sx={{ color: MACRO_COLORS[macro.key].text, fontWeight: 500 }}>
                  {formatMacro(macro.value)} g
                </Box>
              </Typography>
            ))}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
