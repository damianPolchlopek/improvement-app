import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMealSelection } from '../../../context/MealSelectionContext';
import MacroBar from '../../foodView/MacroBar';
import { MACRO_COLORS, formatMacro } from '../../foodView/macroColors';
import { surfaceSx } from '../../../tokens';

// Podsumowanie wybranego dnia: suma kcal i makro, proporcje oraz lista wybranych posiłków.
export default function MealsDaySummary() {
  const { t } = useTranslation();
  const { dietSummary, selectedMeals, toggleMealSelection } = useMealSelection();

  if (!dietSummary) return null;

  const stats = [
    { key: 'kcal', label: t('food.kcal'), value: Math.round(dietSummary.kcal || 0), unit: '' },
    {
      key: 'protein',
      label: t('food.protein'),
      value: formatMacro(dietSummary.protein),
      unit: 'g',
    },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      value: formatMacro(dietSummary.carbohydrates),
      unit: 'g',
    },
    { key: 'fat', label: t('food.fat'), value: formatMacro(dietSummary.fat), unit: 'g' },
  ];

  return (
    <Box sx={{ ...surfaceSx, p: { xs: 2, md: 2.5 }, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.key} sx={{ bgcolor: 'surface.subtle', borderRadius: 2, px: 1.5, py: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
              {stat.label}
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 500, color: MACRO_COLORS[stat.key].text }}>
              {stat.value}
              {stat.unit && (
                <Box component="span" sx={{ fontSize: 14, color: 'text.secondary', ml: 0.25 }}>
                  {stat.unit}
                </Box>
              )}
            </Typography>
          </Box>
        ))}
      </Box>

      <MacroBar
        protein={dietSummary.protein}
        carbohydrates={dietSummary.carbohydrates}
        fat={dietSummary.fat}
        height={8}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {selectedMeals.length > 0 ? (
          selectedMeals.map((meal) => (
            <Chip
              key={meal.mealRecipeId}
              size="small"
              variant="outlined"
              label={meal.amount > 1 ? `${meal.name} ×${meal.amount}` : meal.name}
              onDelete={() => toggleMealSelection(meal)}
            />
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('food.selectMealsHint')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
