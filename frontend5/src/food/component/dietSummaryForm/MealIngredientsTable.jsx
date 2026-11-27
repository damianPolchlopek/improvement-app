import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import IngredientRow from './IngredientRow';

export default function MealIngredientsTable({
  isOpen,
  meal,
  selectedMeal,
  onIngredientAmountChange,
}) {
  const { t } = useTranslation();

  const handleIngredientAmountChange = (ingredientProductId, newAmount) => {
    onIngredientAmountChange(meal, ingredientProductId, newAmount);
  };

  return (
    <TableRow>
      <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={{ ml: { xs: 0, md: 7 }, my: 1, maxWidth: 560 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('food.name')}</TableCell>
                  <TableCell>{t('food.amount')}</TableCell>
                  <TableCell>{t('food.unit')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meal.ingredients.map((ingredient, idx) => {
                  const selectedIngredient = selectedMeal?.ingredients?.find(
                    (i) => i.productId === ingredient.productId
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
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
