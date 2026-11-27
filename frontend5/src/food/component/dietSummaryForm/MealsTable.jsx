import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Table, TableBody, TableContainer } from '@mui/material';

import MealFilter from './MealFilter';
import MealCategoryRow from './MealCategoryRow';
import { foodTableSx } from '../foodStyles';
import { HAIRLINE, surfaceSx } from '../../../tokens';

// components/MealTable/
// ├── MealCategoryRow.jsx     (pojedyncza kategoria posiłków)
// ├── MealsList.jsx           (lista posiłków)
// ├── MealRow.jsx             (pojedynczy posiłek)
// ├── MealIngredientsTable.jsx (tabela składników)
// ├── IngredientRow.jsx       (pojedynczy składnik)

export default function MealsTable() {
  const [mealPopularity, setMealPopularity] = useState('HIGH');
  const [searchTerm, setSearchTerm] = useState('');
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
    <Box sx={surfaceSx}>
      <Box sx={{ borderBottom: HAIRLINE }}>
        <MealFilter
          mealPopularity={mealPopularity}
          setMealPopularity={setMealPopularity}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </Box>
      <TableContainer>
        <Table
          aria-label="collapsible table"
          sx={{ ...foodTableSx, minWidth: 700, width: '100%', tableLayout: 'fixed' }}
        >
          <TableBody>
            {MEAL_CATEGORIES.map((category) => (
              <MealCategoryRow
                key={category.value}
                mealCategory={category.value}
                mealCategoryLabel={category.label}
                mealPopularity={mealPopularity}
                searchTerm={searchTerm}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
