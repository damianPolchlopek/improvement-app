import React from 'react';
import { TableCell, TableRow, TextField } from '@mui/material';

export default function IngredientRow({ ingredient, ingredientAmount, onAmountChange }) {
  const handleAmountChange = (e) => {
    const newValue = parseFloat(e.target.value) || 1;
    onAmountChange(ingredient.productId, newValue);
  };

  return (
    <TableRow>
      <TableCell>{ingredient.name}</TableCell>
      <TableCell>
        <TextField
          value={ingredientAmount}
          size="small"
          variant="outlined"
          onChange={handleAmountChange}
          slotProps={{
            htmlInput: {
              style: { width: 80 },
              type: 'number',
              min: 0,
              step: 0.1,
            },
          }}
        />
      </TableCell>
      <TableCell>{ingredient.unit}</TableCell>
    </TableRow>
  );
}
