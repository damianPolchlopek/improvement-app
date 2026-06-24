import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// Single source of truth for the available training templates (shortcut + label).
// Reused by the statistics view to load all exercises of a chosen template.
export const TRAINING_TYPES = [
  { value: 'F1', label: 'F1' },
  { value: 'F2', label: 'F2' },
  { value: 'F', label: '5x5' },
  { value: 'K1', label: 'Kettle K1' },
  { value: 'K2', label: 'Kettle K2' },
  { value: 'K3', label: 'Kettle K3' },
  { value: 'R', label: 'Rower' },
  { value: 'A', label: 'Siłowy A' },
  { value: 'B', label: 'Siłowy B' },
  { value: 'C', label: 'Hipertroficzny C' },
  { value: 'D', label: 'Hipertroficzny D' },
  { value: 'E', label: 'Basen' },
  { value: 'A1', label: 'Siłowy A1' },
  { value: 'B1', label: 'Siłowy B1' },
  { value: 'C1', label: 'Hipertroficzny C1' },
  { value: 'D1', label: 'Hipertroficzny D1' },
  { value: 'B2', label: 'Siłowy B2' },
  { value: 'A2', label: 'Siłowy A2' },
  { value: 'C2', label: 'Hipertroficzny C2' },
  { value: 'D2', label: 'Hipertroficzny D2' },
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
    <FormControl size={size} sx={{ minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      {select}
    </FormControl>
  );
}
