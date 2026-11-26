import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, MenuItem, TextField } from '@mui/material';
import {
  Restaurant,
  AllInclusive,
  FreeBreakfast,
  LunchDining,
  Whatshot,
  DinnerDining,
  Cake,
} from '@mui/icons-material';

import FoodPageHeader from '../component/FoodPageHeader';
import SearchField from '../component/SearchField';

// Ikony dla kategorii zwracanych przez /meal/categories (wartości wyświetlane z backendu).
const CATEGORY_ICONS = {
  All: <AllInclusive />,
  Śniadanie: <FreeBreakfast />,
  Obiad: <LunchDining />,
  'Ciepły Posiłek': <Whatshot />,
  Kolacja: <DinnerDining />,
  Słodycze: <Cake />,
};

export default function MealViewHeader({
  meals,
  loading,
  searchInput,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  types,
  type,
  onTypeChange,
}) {
  const { t } = useTranslation();

  return (
    <FoodPageHeader
      icon={<Restaurant />}
      title={t('food.browseMeals')}
      description={t('food.browseMealsDesc')}
      statLabel={t('food.mealsLabel')}
      statValue={meals.length}
      statLoading={loading}
      actions={
        <SearchField
          value={searchInput}
          onChange={onSearchChange}
          placeholder={t('food.searchMeal')}
        />
      }
    >
      {categories.map((item) => {
        const active = item === category;
        return (
          <Chip
            key={item}
            icon={CATEGORY_ICONS[item]}
            label={item === 'All' ? t('food.all') : item}
            clickable
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            onClick={() => onCategoryChange(item)}
            sx={{ fontWeight: active ? 600 : 400, '& .MuiChip-icon': { fontSize: 18 } }}
          />
        );
      })}

      {types.length > 0 && (
        <TextField
          select
          size="small"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          aria-label={t('food.mealType')}
          sx={{
            ml: { sm: 'auto' },
            minWidth: 170,
            '& .MuiInputBase-root': { borderRadius: 4, height: 32, fontSize: 13 },
          }}
        >
          {types.map((item) => (
            <MenuItem key={item} value={item}>
              {item === 'All' ? `${t('food.mealType')}: ${t('food.all')}` : item}
            </MenuItem>
          ))}
        </TextField>
      )}
    </FoodPageHeader>
  );
}
