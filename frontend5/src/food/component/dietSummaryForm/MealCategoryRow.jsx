import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import REST from "../../../utils/REST";

import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import {
  IconButton,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import MealsList from './MealsList';

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

export default function MealCategoryRow({ mealPopularity, mealCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: mealList = [], isLoading, isError } = useQuery({
    queryKey: ['mealList', mealCategory, mealPopularity],
    queryFn: () => REST.getMealList(translateMealCategory(mealCategory), 'ALL', '', translateMealPopularity(mealPopularity), 'category'),
    enabled: !!mealCategory && !!mealPopularity && isOpen,
    select: (res) => res.entity,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
  });

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <StyledTableRow onClick={toggleOpen}>
        <StyledTableCell sx={{width: '50px'}}>
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

      <MealsList
        isOpen={isOpen}
        mealList={mealList}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
}