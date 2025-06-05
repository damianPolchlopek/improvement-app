import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapse,
  Table,
  TableBody,
  TableHead
} from '@mui/material';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';
import IngredientRow from './IngredientRow';

export default function MealIngredientsTable({ 
  isOpen, 
  meal, 
  selectedMeal, 
  onIngredientAmountChange 
}) {
  const { t } = useTranslation();

  const handleIngredientAmountChange = (ingredientId, newAmount) => {
    onIngredientAmountChange(meal, ingredientId, newAmount);
  };

  return (
    <StyledTableRow>
      <StyledTableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit
        >
          <Table size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>{t('food.name')}</StyledTableCell>
                <StyledTableCell>{t('food.amount')}</StyledTableCell>
                <StyledTableCell>{t('food.unit')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {meal.ingredients.map((ingredient, idx) => {
                const selectedIngredient = selectedMeal?.ingredients?.find(
                  i => i.productId === ingredient.productId
                );
                
                const ingredientAmount = selectedIngredient?.amount ?? ingredient.amount;

                return (
                  <IngredientRow
                    key={idx}
                    ingredient={ingredient}
                    ingredientAmount={ingredientAmount}
                    onAmountChange={handleIngredientAmountChange}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
}