import React, { useState } from 'react';
import { 
  IconButton, 
  Checkbox, 
  TextField 
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';
import { formatInput } from '../../../utils/common';
import { useMealSelection } from '../../../context/MealSelectionContext';
import MealIngredientsTable from './MealIngredientsTable';

export default function MealRow({ meal, index }) {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const { 
    selectedMeals,
    toggleMealSelection, 
    updateMealAmount, 
    updateMealIngredient,
    isMealSelected 
  } = useMealSelection();

  const isItemSelected = isMealSelected(meal.id);
  const selectedMeal = selectedMeals.find(m => m.id === meal.id);
  const currentAmount = selectedMeal?.amount || 1;

  const handleMealToggle = () => {
    const existingMeal = selectedMeals.find(m => m.id === meal.id);
    const currentAmount = existingMeal?.amount || 1;
    toggleMealSelection(meal, currentAmount);
  };

  const handleMealAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 1;
    const isSelected = isMealSelected(meal.id);
    
    if (isSelected) {
      updateMealAmount(meal.id, newAmount);
    } else if (newAmount > 1) {
      toggleMealSelection(meal, newAmount);
    }
  };

  const handleMealIngredientChange = (meal, ingredientId, newAmount) => {
    const isSelected = isMealSelected(meal.id);
    if (isSelected) {
      updateMealIngredient(meal.id, ingredientId, newAmount);
    } else {
      toggleMealSelection(meal, 1);
      updateMealIngredient(meal.id, ingredientId, newAmount);
    }
  };

  const toggleIngredientsOpen = (e) => {
    e.stopPropagation();
    setIsIngredientsOpen(prev => !prev);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    handleMealToggle();
  };

  const handleAmountInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <React.Fragment>
      <StyledTableRow
        key={index}
        selected={isItemSelected}
      >
        <StyledTableCell sx={{width: '50px'}}>
          <IconButton
            aria-label="expand ingredients"
            size="small"
            onClick={toggleIngredientsOpen}
          >
            {isIngredientsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        
        <StyledTableCell>
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onClick={handleCheckboxClick}
          />
        </StyledTableCell>
        
        <StyledTableCell onClick={handleMealToggle}>
          {meal.name}
        </StyledTableCell>
        
        <StyledTableCell onClick={handleMealToggle}>
          {formatInput(meal.kcal)}
        </StyledTableCell>
        
        <StyledTableCell onClick={handleMealToggle}>
          {formatInput(meal.protein)}
        </StyledTableCell>
        
        <StyledTableCell onClick={handleMealToggle}>
          {formatInput(meal.carbohydrates)}
        </StyledTableCell>
        
        <StyledTableCell onClick={handleMealToggle}>
          {formatInput(meal.fat)}
        </StyledTableCell>
        
        <StyledTableCell onClick={handleAmountInputClick}>
          <TextField
            value={currentAmount}
            size="small"
            inputProps={{ 
              style: { width: 60 },
              type: 'number',
              min: 1,
              step: 1
            }}
            variant="outlined"
            onChange={handleMealAmountChange}
            onClick={handleAmountInputClick}
          />
        </StyledTableCell>
      </StyledTableRow>

      <MealIngredientsTable
        isOpen={isIngredientsOpen}
        meal={meal}
        selectedMeal={selectedMeal}
        onIngredientAmountChange={handleMealIngredientChange}
      />
    </React.Fragment>
  );
}