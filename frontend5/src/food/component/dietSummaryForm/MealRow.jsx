import { useState } from 'react';
import { IconButton, Checkbox, TableCell, TableRow, TextField } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatInput } from '../../../utils/common';
import { MACRO_COLORS } from '../../foodView/macroColors';
import { useMealSelection } from '../../../context/MealSelectionContext';
import MealIngredientsTable from './MealIngredientsTable';
import { useMealRecalculation } from '../../../context/useMealRecalculation';

export default function MealRow({ meal: single, index }) {
  const [meal, setMeal] = useState(single);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const {
    selectedMeals,
    toggleMealSelection,
    updateMealAmount,
    updateMealIngredient,
    isMealSelected,
  } = useMealSelection();
  const { recalculateMeal } = useMealRecalculation();

  const isItemSelected = isMealSelected(meal.mealRecipeId);
  const selectedMeal = selectedMeals.find((m) => m.id === meal.id);
  const currentAmount = selectedMeal?.amount || 1;

  const handleMealToggle = () => {
    const existingMeal = selectedMeals.find((m) => m.id === meal.id);
    const currentAmount = existingMeal?.amount || 1;
    toggleMealSelection(meal, currentAmount);
  };

  const handleMealAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 1;
    const isSelected = isMealSelected(meal.mealRecipeId);

    if (isSelected) {
      updateMealAmount(meal.id, newAmount);
    } else if (newAmount > 1) {
      toggleMealSelection(meal, newAmount);
    }
  };

  const handleMealIngredientChange = (meal, ingredientProductId, newAmount) => {
    // Pobierz aktualny amount dla całego posiłku
    const amount = selectedMeal?.amount || 1;

    // Zaktualizuj amount tylko dla wybranego składnika
    const updatedIngredients = meal.ingredients.map((ingredient) =>
      ingredient.productId === ingredientProductId
        ? { ...ingredient, amount: newAmount }
        : ingredient
    );

    // Stwórz nowy obiekt meal z poprawionym amount i zaktualizowanymi składnikami
    const mealWithAmount = { ...meal, portionMultiplier: amount, ingredients: updatedIngredients };

    recalculateMeal.mutate(mealWithAmount, {
      onSuccess: (response) => {
        setMeal((prev) => ({
          ...prev,
          kcal: response.kcal,
          protein: response.protein,
          carbohydrates: response.carbohydrates,
          fat: response.fat,
        }));
      },
    });

    const isSelected = isMealSelected(meal.mealRecipeId);
    if (isSelected) {
      updateMealIngredient(meal.mealRecipeId, ingredientProductId, newAmount);
    } else {
      toggleMealSelection(mealWithAmount, 1);
      updateMealIngredient(meal.mealRecipeId, ingredientProductId, newAmount);
    }
  };

  const toggleIngredientsOpen = (e) => {
    e.stopPropagation();
    setIsIngredientsOpen((prev) => !prev);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    handleMealToggle();
  };

  const handleAmountInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <TableRow key={index} selected={isItemSelected}>
        <TableCell sx={{ width: '50px' }}>
          <IconButton
            aria-label="expand ingredients"
            aria-expanded={isIngredientsOpen}
            size="small"
            onClick={toggleIngredientsOpen}
          >
            {isIngredientsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Checkbox color="primary" checked={isItemSelected} onClick={handleCheckboxClick} />
        </TableCell>

        <TableCell
          onClick={handleMealToggle}
          sx={{ cursor: 'pointer', fontWeight: isItemSelected ? 500 : 400 }}
        >
          {meal.name}
        </TableCell>

        {[
          ['kcal', meal.kcal],
          ['protein', meal.protein],
          ['carbohydrates', meal.carbohydrates],
          ['fat', meal.fat],
        ].map(([macro, value]) => (
          <TableCell
            key={macro}
            align="right"
            onClick={handleMealToggle}
            sx={{ cursor: 'pointer', color: MACRO_COLORS[macro].text }}
          >
            {formatInput(value)}
          </TableCell>
        ))}

        <TableCell align="right" onClick={handleAmountInputClick}>
          <TextField
            value={currentAmount}
            size="small"
            variant="outlined"
            onChange={handleMealAmountChange}
            onClick={handleAmountInputClick}
            slotProps={{
              htmlInput: {
                style: { width: 60 },
                type: 'number',
                min: 1,
                step: 1,
              },
            }}
          />
        </TableCell>
      </TableRow>

      <MealIngredientsTable
        isOpen={isIngredientsOpen}
        meal={meal}
        selectedMeal={selectedMeal}
        onIngredientAmountChange={handleMealIngredientChange}
      />
    </>
  );
}
