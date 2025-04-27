import * as React from 'react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

import MealFilter from "./mealTableComponent/MealFilter";
import MealTableRow from './MealTableRow';

import {
  Table,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';

export default function MealsTableForm({ isSelected, handleClick }) {
  const [ mealPopularity, setMealPopularity ] = useState('HIGH');
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
              <MealTableRow
                key={index}
                mealCategory={mealCategory}
                sx={{textAlign: 'left'}}
                isSelected={isSelected}
                handleClick={handleClick}
                mealPopularity={mealPopularity}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}