import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import REST from "../../../utils/REST";
import { useTranslation } from 'react-i18next';
import { formatInput } from '../../../utils/common';
import { useMealSelection } from '../../../context/MealSelectionContext';

import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Checkbox,
  CircularProgress,
  TextField
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

export default function MealTableRow({ mealPopularity, mealCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { 
    selectedMeals,
    toggleMealSelection, 
    updateMealAmount, 
    isMealSelected 
  } = useMealSelection();

  // React Query - Fetch meals based on category and popularity
  const { data: mealList = [], isLoading, isError } = useQuery({
    queryKey: ['mealList', mealCategory, mealPopularity],
    queryFn: () => REST.getMealList(translateMealCategory(mealCategory), 'ALL', '', translateMealPopularity(mealPopularity), 'category'),
    enabled: !!mealCategory && !!mealPopularity && isOpen,
    select: (res) => res.entity,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
  });
  
  const handleMealToggle = (meal) => {
    const existingMeal = selectedMeals.find(m => m.id === meal.id);
    const currentAmount = existingMeal?.amount || 1;
    toggleMealSelection(meal, currentAmount);
  };

  // Handle amount change for a meal
  const handleAmountChange = (meal, newAmount) => {
    const isSelected = isMealSelected(meal.id);
    
    if (isSelected) {
      updateMealAmount(meal.id, newAmount);
    } 
    else if (newAmount > 1) {
      toggleMealSelection(meal, newAmount);
    }

  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>{t('food.errorLoadingMeals')}</div>;
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
                  <StyledTableCell>{t('food.amount')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mealList.map((meal) => {
                  const isItemSelected = isMealSelected(meal.id);
                  const selectedMeal = selectedMeals.find(m => m.id === meal.id);
                  const currentAmount = selectedMeal?.amount || 1;

                  return (
                    <StyledTableRow
                      key={meal.id}
                      selected={isItemSelected}
                    >
                      <StyledTableCell>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleMealToggle(meal);
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell 
                        onClick={() => handleMealToggle(meal)}
                      >
                        {meal.name}
                      </StyledTableCell>
                      <StyledTableCell 
                        onClick={() => handleMealToggle(meal)}
                      >
                        {formatInput(meal.kcal)}
                      </StyledTableCell>
                      <StyledTableCell 
                        onClick={() => handleMealToggle(meal)}
                      >
                        {formatInput(meal.protein)}
                      </StyledTableCell>
                      <StyledTableCell 
                        onClick={() => handleMealToggle(meal)}
                      >
                        {formatInput(meal.carbohydrates)}
                      </StyledTableCell>
                      <StyledTableCell 
                        onClick={() => handleMealToggle(meal)}
                      >
                        {formatInput(meal.fat)}
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={(e) => e.stopPropagation()} // Prevent triggering row click
                      >
                        <TextField
                          value={currentAmount}
                          size="small"
                          inputProps={{ 
                            style: { width: 60 },
                            // min: 1,
                            // step: 1
                          }}
                          variant="outlined"
                          onChange={(e) => {
                            const newAmount = parseFloat(e.target.value) || 1;
                            console.log('New amount:', newAmount);
                            console.log(e.target.value)
                            handleAmountChange(meal, newAmount);
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent bubbling
                        />
                      </StyledTableCell>
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