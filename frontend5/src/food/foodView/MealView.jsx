import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { SearchOff } from '@mui/icons-material';

import REST from '../../utils/REST';
import MealCard from './MealCard';
import MealDetailsPanel from './MealDetailsPanel';
import MealViewHeader from './MealViewHeader';

const CARD_GRID_SIZE = { xs: 12, sm: 6, lg: 4, xl: 3 };

// Liczba kart w rzędzie – musi odpowiadać CARD_GRID_SIZE.
function useColumnsPerRow() {
  const theme = useTheme();
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const lg = useMediaQuery(theme.breakpoints.up('lg'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  if (xl) return 4;
  if (lg) return 3;
  if (sm) return 2;
  return 1;
}

export default function MealView() {
  const { t } = useTranslation();
  const columns = useColumnsPerRow();

  const [mealName, setMealName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [mealCategory, setMealCategory] = useState('Obiad');
  const [mealType, setMealType] = useState('All');
  const [selectedMealId, setSelectedMealId] = useState(null);

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setMealName(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: mealCategoryList = [] } = useQuery({
    queryKey: ['mealCategories'],
    queryFn: REST.getMealCategoryList,
  });

  const { data: mealTypeList = [] } = useQuery({
    queryKey: ['mealTypes'],
    queryFn: REST.getMealTypeList,
  });

  const {
    data: mealList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['meals', mealCategory, mealType, mealName],
    queryFn: () => REST.getMealList(mealCategory, mealType, mealName, 'ALL', 'name', false),
    enabled: !!mealCategory && !!mealType,
    staleTime: 1000 * 60 * 5,
  });

  // Panel szczegółów wstawiamy za ostatnią kartą rzędu, w którym jest wybrany posiłek.
  const selectedIndex = mealList.findIndex((meal) => meal.id === selectedMealId);
  const panelAfterIndex =
    selectedIndex < 0
      ? -1
      : Math.min((Math.floor(selectedIndex / columns) + 1) * columns, mealList.length) - 1;

  const toggleMeal = (meal) => setSelectedMealId((id) => (id === meal.id ? null : meal.id));
  const closePanel = () => setSelectedMealId(null);

  useEffect(() => {
    if (selectedMealId == null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedMealId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMealId]);

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <MealViewHeader
        meals={mealList}
        loading={isLoading}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        categories={mealCategoryList}
        category={mealCategory}
        onCategoryChange={setMealCategory}
        types={mealTypeList}
        type={mealType}
        onTypeChange={setMealType}
      />

      {/* Wyniki */}
      {isError ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: 'error.main' }}>
            {t('food.error')}: {error?.message || t('food.unknownError')}
          </Typography>
        </Box>
      ) : isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} size={CARD_GRID_SIZE}>
              <Skeleton variant="rounded" height={168} sx={{ borderRadius: 2.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : mealList.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <SearchOff sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>{t('food.noMealsFound')}</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {mealList.map((meal, index) => (
            <React.Fragment key={meal.id}>
              <Grid size={CARD_GRID_SIZE}>
                <MealCard meal={meal} selected={selectedMealId === meal.id} onSelect={toggleMeal} />
              </Grid>
              {index === panelAfterIndex && (
                <Grid size={12}>
                  <MealDetailsPanel meal={mealList[selectedIndex]} onClose={closePanel} />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Box>
  );
}
