import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

import REST, { queryClient } from '../utils/REST';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import { surfaceSx } from '../food/component/foodStyles';
import { fieldSx } from '../other/component/otherStyles';
import { categoryColor } from './shoppingCategories';

// Dodawanie produktu w jednym rzędzie: nazwa, kategoria, przycisk (Enter zapisuje).
export default function ShoppingForm({ categories, defaultCategory }) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Domyślnie kategoria wybrana w filtrze listy (wartość pochodna, bez efektu)
  const category = selectedCategory || defaultCategory || categories[0] || '';

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addProductToShoppingList({ name: name.trim(), category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
      showSnackbar(t('shopping.addSuccess'), 'success');
      setName('');
    },
    onError: () => {
      showSnackbar(t('shopping.addError'), 'error');
    },
    retry: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      showSnackbar(t('shopping.nameRequired'), 'warning');
      return;
    }
    mutate();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      aria-label={t('shopping.addItem')}
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
        label={t('shopping.name')}
        placeholder={t('shopping.enterName')}
        size="small"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ ...fieldSx, flex: '1 1 260px' }}
      />
      <TextField
        select
        label={t('shopping.category')}
        size="small"
        value={category}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ ...fieldSx, flex: '0 1 220px', minWidth: 170 }}
      >
        {categories.map((c) => (
          <MenuItem key={c} value={c}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: categoryColor(c).dot,
                mr: 1,
              }}
            />
            {t(`shopping.categories.${c}`)}
          </MenuItem>
        ))}
      </TextField>
      <Button
        type="submit"
        variant="contained"
        disabled={isPending || !category}
        startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <AddShoppingCart />}
      >
        {isPending ? t('common.saving') : t('shopping.add')}
      </Button>
    </Box>
  );
}
