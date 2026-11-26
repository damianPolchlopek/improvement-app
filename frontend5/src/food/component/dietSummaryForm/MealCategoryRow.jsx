import React, { useState } from 'react';
import { Box, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

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

  return (
    <>
      <TableRow
        hover
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isExpanded}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell colSpan={2} sx={{ py: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <KeyboardArrowDown
              fontSize="small"
              sx={{
                color: 'text.secondary',
                transition: 'transform 150ms',
                transform: isExpanded ? 'rotate(180deg)' : 'none',
              }}
            />
            <Typography sx={{ fontWeight: 500 }}>{mealCategoryLabel}</Typography>
            {selectedCount > 0 && (
              <Chip size="small" color="primary" label={selectedCount} sx={{ height: 20 }} />
            )}
          </Box>
        </TableCell>
      </TableRow>

      <MealsList
        isOpen={isExpanded}
        searchTerm={searchTerm}
        mealPopularity={mealPopularity}
        mealCategory={mealCategory}
      />
    </>
  );
}
