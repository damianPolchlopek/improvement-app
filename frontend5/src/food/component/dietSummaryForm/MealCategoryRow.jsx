import React, { useState } from "react";


import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import {
  IconButton,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import MealsList from './MealsList';

export default function MealCategoryRow({ mealPopularity, mealCategory }) {
  const [isOpen, setIsOpen] = useState(false);

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
        mealPopularity={mealPopularity}
        mealCategory={mealCategory}
      />
    </>
  );
}