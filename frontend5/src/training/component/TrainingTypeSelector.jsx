import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function TrainingTypeSelector({ setTrainingType, value, size = 'medium', label }) {
  // Kontrolowany, gdy podano `value`; w przeciwnym razie niekontrolowany z domyślnym 'A'
  const selectionProps = value === undefined ? { defaultValue: 'A' } : { value };

  const select = (
    <Select
      {...selectionProps}
      size={size}
      label={label}
      displayEmpty
      onChange={(e) => setTrainingType(e.target.value)}
    >
      <MenuItem value="F1">F1</MenuItem>
      <MenuItem value="F2">F2</MenuItem>
      <MenuItem value="F">5x5</MenuItem>
      <MenuItem value="K1">Kettle K1</MenuItem>
      <MenuItem value="K2">Kettle K2</MenuItem>
      <MenuItem value="K3">Kettle K3</MenuItem>
      <MenuItem value="R">Rower</MenuItem>
      <MenuItem value="A">Siłowy A</MenuItem>
      <MenuItem value="B">Siłowy B</MenuItem>
      <MenuItem value="C">Hipertroficzny C</MenuItem>
      <MenuItem value="D">Hipertroficzny D</MenuItem>
      <MenuItem value="E">Basen</MenuItem>
      <MenuItem value="A1">Siłowy A1</MenuItem>
      <MenuItem value="B1">Siłowy B1</MenuItem>
      <MenuItem value="C1">Hipertroficzny C1</MenuItem>
      <MenuItem value="D1">Hipertroficzny D1</MenuItem>
      <MenuItem value="B2">Siłowy B2</MenuItem>
      <MenuItem value="A2">Siłowy A2</MenuItem>
      <MenuItem value="C2">Hipertroficzny C2</MenuItem>
      <MenuItem value="D2">Hipertroficzny D2</MenuItem>
    </Select>
  );

  if (!label) return select;

  return (
    <FormControl size={size} sx={{ minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      {select}
    </FormControl>
  );
}
