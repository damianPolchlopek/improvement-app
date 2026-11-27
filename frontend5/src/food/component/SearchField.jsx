import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function SearchField({ value, onChange, placeholder, sx }) {
  const { t } = useTranslation();

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{
        width: { xs: '100%', sm: 300 },
        '& .MuiInputBase-root': { bgcolor: 'surface.field' },
        ...sx,
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label={t('food.clearSearch')}
                onClick={() => onChange('')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
