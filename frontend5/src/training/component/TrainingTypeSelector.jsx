import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// Single source of truth for the available training templates (shortcut + label).
// Reused by the statistics view to load all exercises of a chosen template.
export const TRAINING_TYPES = [
  { value: 'F1', label: 'F1' },
  { value: 'F2', label: 'F2' },
  { value: 'F', label: '5x5' },
  { value: 'F3A', label: 'FBW#3-A' },
  { value: 'F3B', label: 'FBW#3-B' },
  { value: 'K1', label: 'Kettle K1' },
  { value: 'K2', label: 'Kettle K2' },
  { value: 'K3', label: 'Kettle K3' },
  { value: 'R', label: 'Rower' },
  { value: 'A', label: 'Siłowy A' },
  { value: 'B', label: 'Siłowy B' },
  { value: 'C', label: 'Hipertroficzny C' },
  { value: 'D', label: 'Hipertroficzny D' },
  { value: 'E', label: 'Basen' },
];

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
      {TRAINING_TYPES.map((type) => (
        <MenuItem key={type.value} value={type.value}>
          {type.label}
        </MenuItem>
      ))}
    </Select>
  );

  if (!label) return select;

  return (
    <FormControl
      size={size}
      sx={{ minWidth: { xs: 0, sm: 200 }, width: { xs: '100%', sm: 'auto' } }}
    >
      <InputLabel>{label}</InputLabel>
      {select}
    </FormControl>
  );
}
