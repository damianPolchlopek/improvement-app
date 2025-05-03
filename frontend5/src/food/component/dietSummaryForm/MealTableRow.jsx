import * as React from 'react';
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import REST from "../../../utils/REST";
import { useTranslation } from 'react-i18next';

import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Checkbox,
  CircularProgress
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
  return categoryTranslation.get(arg);
}

function translateMealPopularity(arg) {
  return popularityTranslation.get(arg);
}

export default function MealTableRow({ mealPopularity, mealCategory, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // ⚡ React Query - Pobieranie posiłków na podstawie kategorii i popularności
  const { data: mealList = [], isLoading, isError } = useQuery({
    queryKey: ['mealList', mealCategory, mealPopularity],
    queryFn: () => REST.getMealList(translateMealCategory(mealCategory), 'ALL', '', translateMealPopularity(mealPopularity), 'category'),
    enabled: !!mealCategory && !!mealPopularity && isOpen,
    select: (res) => res.entity,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minut - zmień na ile chcesz
    cacheTime: 1000 * 60 * 10 // trzymanie danych w cache przez 10 minut
  });
  
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>{t('food.errorLoadingMeals')}</div>;
  }

  const formatInput = (value) => {
    return Number(value).toFixed(2);
  }

  return (
    <>
      <StyledTableRow onClick={() => { setIsOpen((open) => !open); }}>
        <StyledTableCell sx={{width: '50px'}} >
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {mealCategory}
        </StyledTableCell>
      </StyledTableRow>

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
                  <StyledTableCell>{t('food.name')}</StyledTableCell>
                  <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                  <StyledTableCell>{t('food.protein')}</StyledTableCell>
                  <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                  <StyledTableCell>{t('food.fat')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mealList.map((meal) => {
                  const isItemSelected = props.isSelected(meal.id);

                  return (
                    <StyledTableRow
                      onClick={(event) => props.handleClick(event, meal.id)}
                      key={meal.name}
                      selected={isItemSelected}
                    >
                      <StyledTableCell>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{meal.name}</StyledTableCell>
                      <StyledTableCell>{formatInput(meal.kcal)}</StyledTableCell>
                      <StyledTableCell>{formatInput(meal.protein)}</StyledTableCell>
                      <StyledTableCell>{formatInput(meal.carbohydrates)}</StyledTableCell>
                      <StyledTableCell>{formatInput(meal.fat)}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
