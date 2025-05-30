import React from 'react';
import { TextField } from '@mui/material';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

export default function IngredientRow({ 
  ingredient, 
  ingredientAmount, 
  onAmountChange 
}) {
  const handleAmountChange = (e) => {
    const newValue = parseFloat(e.target.value) || 1;
    onAmountChange(ingredient.productId, newValue);
  };

  return (
    <StyledTableRow>
      <StyledTableCell>{ingredient.name}</StyledTableCell>
      <StyledTableCell>
        <TextField
          value={ingredientAmount}
          size="small"
          variant="outlined"
          onChange={handleAmountChange}
          inputProps={{ 
            style: { width: 80 },
            type: 'number',
            min: 0,
            step: 0.1
          }}
        />
      </StyledTableCell>
      <StyledTableCell>{ingredient.unit}</StyledTableCell>
    </StyledTableRow>
  );
}