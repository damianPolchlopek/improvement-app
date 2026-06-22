import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import MealFilter from './MealFilter';
import MealCategoryRow from './MealCategoryRow';

import { Table, TableBody, TableContainer, Paper } from '@mui/material';

// components/MealTable/
// ├── MealCategoryRow.jsx     (pojedyncza kategoria posiłków)
// ├── MealsList.jsx           (lista posiłków)
// ├── MealRow.jsx             (pojedynczy posiłek)
// ├── MealIngredientsTable.jsx (tabela składników)
// ├── IngredientRow.jsx       (pojedynczy składnik)

export default function MealsTable() {
  const [mealPopularity, setMealPopularity] = useState('HIGH');
  const { t } = useTranslation();

  // value = stała wartość wysyłana do backendu (niezależna od języka),
  // label = przetłumaczona etykieta tylko do wyświetlenia
  const MEAL_CATEGORIES = [
    { value: 'Śniadanie', label: t('food.breakfast') },
    { value: 'Obiad', label: t('food.lunch') },
    { value: 'Ciepły Posiłek', label: t('food.hotDish') },
    { value: 'Kolacja', label: t('food.dinner') },
    { value: 'Słodycze', label: t('food.sweets') },
    { value: 'All', label: t('food.other') },
  ];

  return (
    <Paper sx={{ minWidth: 700 }}>
      <MealFilter mealPopularity={mealPopularity} setMealPopularity={setMealPopularity} />
      <TableContainer>
        <Table aria-label="collapsible table" sx={{ minWidth: 700 }}>
          <TableBody>
            {MEAL_CATEGORIES.map((category) => (
              <MealCategoryRow
                key={category.value}
                mealCategory={category.value}
                mealCategoryLabel={category.label}
                mealPopularity={mealPopularity}
                sx={{ textAlign: 'left' }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
