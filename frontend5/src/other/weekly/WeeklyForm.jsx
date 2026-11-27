import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';

import REST, { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { surfaceSx } from '../../food/component/foodStyles';
import { fieldSx } from '../component/otherStyles';

// Dodawanie rekordu w jednym rzędzie: nazwa, kategoria, przycisk.
export default function WeeklyForm({ categories, defaultCategory }) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Domyślnie kategoria wybrana w widoku listy (wartość pochodna, bez efektu)
  const category = selectedCategory || defaultCategory || '';

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addRecordToWeeklyList({ name: name.trim(), category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSnackbar(t('weekly.addSuccess'), 'success');
      setName('');
    },
    onError: () => {
      showSnackbar(t('weekly.addError'), 'error');
    },
    retry: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      showSnackbar(t('weekly.nameRequired'), 'warning');
      return;
    }
    mutate();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      aria-label={t('weekly.addRecord')}
      sx={{
        ...surfaceSx,
        mb: 3,
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <TextField
        label={t('weekly.recordName')}
        placeholder={t('weekly.enterName')}
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ ...fieldSx, flex: '1 1 260px' }}
      />
      <TextField
        select
        label={t('weekly.category')}
        size="small"
        value={category}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ ...fieldSx, flex: '0 1 200px', minWidth: 160 }}
      >
        {categories.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>
      <Button
        type="submit"
        variant="contained"
        disabled={isPending || !category}
        startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Add />}
      >
        {isPending ? t('common.saving') : t('weekly.add')}
      </Button>
    </Box>
  );
}
