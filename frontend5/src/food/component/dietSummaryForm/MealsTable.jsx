import { useState } from "react";
import { useTranslation } from 'react-i18next';

import MealFilter from "./MealFilter";
import MealCategoryRow from './MealCategoryRow';

import {
  Table,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';

// components/MealTable/
// ├── MealCategoryRow.jsx     (pojedyncza kategoria posiłków)
// ├── MealsList.jsx           (lista posiłków)
// ├── MealRow.jsx             (pojedynczy posiłek)
// ├── MealIngredientsTable.jsx (tabela składników)
// ├── IngredientRow.jsx       (pojedynczy składnik)

export default function MealsTable() {
  const [mealPopularity, setMealPopularity] = useState('HIGH');
  const { t } = useTranslation();

  const MEALS_CATEGORY = [
    t('food.breakfast'),
    t('food.lunch'),
    t('food.hotDish'),
    t('food.dinner'),
    t('food.sweets'),
    t('food.other')
  ];

  return (
    <Paper sx={{ minWidth: 700 }}>
      <MealFilter
        mealPopularity={mealPopularity}
        setMealPopularity={setMealPopularity}
      />
      <TableContainer>
        <Table aria-label="collapsible table" sx={{ minWidth: 700 }}>
          <TableBody>
            {MEALS_CATEGORY.map((mealCategory, index) => (
              <MealCategoryRow
                key={index}
                mealCategory={mealCategory}
                mealPopularity={mealPopularity}
                sx={{textAlign: 'left'}}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}