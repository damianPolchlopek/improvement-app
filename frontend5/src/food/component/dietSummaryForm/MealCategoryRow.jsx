import React, { useState } from 'react';

import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import { Chip, IconButton } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import MealsList from './MealsList';
import { useMealSelection } from '../../../context/MealSelectionContext';

export default function MealCategoryRow({
  mealPopularity,
  mealCategory,
  mealCategoryLabel,
  searchTerm,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedMeals } = useMealSelection();

  // Aktywne wyszukiwanie rozwija wszystkie kategorie, by pokazać dopasowania.
  const isExpanded = isOpen || !!searchTerm;

  const selectedCount = selectedMeals.filter((meal) => meal.mealCategory === mealCategory).length;

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <StyledTableRow onClick={toggleOpen} sx={{ cursor: 'pointer' }}>
        <StyledTableCell sx={{ width: '50px' }}>
          <IconButton aria-label="expand row" size="small">
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {mealCategoryLabel}
          {selectedCount > 0 && (
            <Chip size="small" color="primary" label={selectedCount} sx={{ ml: 1 }} />
          )}
        </StyledTableCell>
      </StyledTableRow>

      <MealsList
        isOpen={isExpanded}
        searchTerm={searchTerm}
        mealPopularity={mealPopularity}
        mealCategory={mealCategory}
      />
    </>
  );
}
