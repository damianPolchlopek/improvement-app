import React from 'react';
import { Box, Chip } from '@mui/material';
import { TRAINING_TYPES } from './TrainingTypeSelector';
import { typeGroup } from '../trainingView/trainingWeeks';

// Wybór typu treningu jako rząd chipów z kropką w kolorze grupy (jak filtr widoku treningów).
export default function TrainingTypeChips({ value, onChange }) {
  return TRAINING_TYPES.map((type) => {
    const active = type.value === value;
    const group = typeGroup(type.value);
    return (
      <Chip
        key={type.value}
        label={type.label}
        clickable
        variant={active ? 'filled' : 'outlined'}
        aria-pressed={active}
        onClick={() => onChange(type.value)}
        icon={
          <Box
            component="span"
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: group.dot }}
          />
        }
        sx={{
          fontWeight: active ? 600 : 400,
          '& .MuiChip-icon': { ml: 1.25, mr: -0.25 },
          ...(active
            ? { bgcolor: group.bg, color: group.text, '&:hover': { bgcolor: group.bg } }
            : {}),
        }}
      />
    );
  });
}
