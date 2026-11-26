import { useEffect, useState } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RestartAlt } from '@mui/icons-material';
import { useMealSelection } from '../../../context/MealSelectionContext';
import SearchField from '../SearchField';

export default function MealFilter({
  mealPopularity,
  setMealPopularity,
  searchTerm,
  setSearchTerm,
}) {
  const { t } = useTranslation();
  const { clearSelections } = useMealSelection();
  const [searchInput, setSearchInput] = useState(searchTerm ?? '');

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput, setSearchTerm]);

  const popularityOptions = [
    { value: 'HIGH', label: t('food.popular') },
    { value: 'LOW', label: t('food.rare') },
    { value: 'ALL', label: t('food.all') },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 2,
        rowGap: 1.5,
        px: 2,
        py: 1.5,
      }}
    >
      <SearchField
        value={searchInput}
        onChange={setSearchInput}
        placeholder={t('food.searchMeal')}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('food.mealPopularity')}
        </Typography>
        {popularityOptions.map((option) => {
          const active = option.value === mealPopularity;
          return (
            <Chip
              key={option.value}
              label={option.label}
              size="small"
              clickable
              color={active ? 'primary' : 'default'}
              variant={active ? 'filled' : 'outlined'}
              onClick={() => setMealPopularity(option.value)}
              sx={{ fontWeight: active ? 600 : 400 }}
            />
          );
        })}
      </Box>

      <Button
        variant="text"
        size="small"
        startIcon={<RestartAlt />}
        sx={{ ml: 'auto', color: 'text.secondary' }}
        onClick={clearSelections}
      >
        {t('food.clearSelections')}
      </Button>
    </Box>
  );
}
