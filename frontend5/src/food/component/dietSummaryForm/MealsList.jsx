import React from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from "../../../utils/REST";
import { useTranslation } from 'react-i18next';
import {
  Collapse,
  Table,
  TableBody,
  TableHead,
  CircularProgress
} from '@mui/material';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';
import MealRow from './MealRow';


const categoryTranslation = new Map([
  ['Other', 'All'],
  ['Lunch', 'Obiad'],
  ['Breakfast', 'Śniadanie'],
  ['Hot Dish', 'Ciepły Posiłek'],
  ['Sweets', 'Słodycze'],
  ['Dinner', 'Kolacja'],
]);

const popularityTranslation = new Map([
  ['ALL', 'All'],
  ['HIGH', 'Wysoka'],
  ['LOW', 'Niska'],
]);

function translateMealCategory(arg) {
  return categoryTranslation.get(arg) ?? 'Other';
}

function translateMealPopularity(arg) {
  return popularityTranslation.get(arg) ?? 'ALL';
}


export default function MealsList({ 
  isOpen, 
  mealCategory, 
  mealPopularity 
}) {
  const { t } = useTranslation();

  const { data: mealList = [], isLoading, isError } = useQuery({
    queryKey: ['mealList', mealCategory, mealPopularity],
    queryFn: () => REST.getMealList(translateMealCategory(mealCategory), 'ALL', '', 
                                    translateMealPopularity(mealPopularity), 'category', true),
                                    
    enabled: !!mealCategory && !!mealPopularity && isOpen,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
  });


  if (isLoading) {
    return (
      <TableBody>
        <StyledTableRow>
          <StyledTableCell colSpan={8} align="center">
            <CircularProgress />
          </StyledTableCell>
        </StyledTableRow>
      </TableBody>
    );
  }

  if (isError) {
    return (
      <TableBody>
        <StyledTableRow>
          <StyledTableCell colSpan={8} align="center">
            {t('food.errorLoadingMeals')}
          </StyledTableCell>
        </StyledTableRow>
      </TableBody>
    );
  }

  return (
    <StyledTableRow>
      <StyledTableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit
        >
          <Table size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell padding="checkbox"></StyledTableCell>
                <StyledTableCell padding="checkbox"></StyledTableCell>
                <StyledTableCell>{t('food.name')}</StyledTableCell>
                <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                <StyledTableCell>{t('food.protein')}</StyledTableCell>
                <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                <StyledTableCell>{t('food.fat')}</StyledTableCell>
                <StyledTableCell>{t('food.amount')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {mealList.map((meal, index) => (
                <MealRow 
                  key={meal.id || index} 
                  meal={meal} 
                  index={index} 
                />
              ))}
            </TableBody>
          </Table>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
}