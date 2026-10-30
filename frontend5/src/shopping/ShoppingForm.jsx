import React, { useState } from 'react';
import REST from '../utils/REST';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../utils/REST';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';

import Grid from '@mui/material/Grid';
import {
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

export default function ShoppingForm({ categories, defaultCategory }) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();

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
    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: theme.palette.card.header,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <AddShoppingCart sx={{ fontSize: 22 }} />
        <Typography variant="subtitle1" fontWeight="600">
          {t('shopping.addItem')}
        </Typography>
      </Box>

      {/* Form body */}
      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('shopping.name')}
                placeholder={t('shopping.enterName')}
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>{t('shopping.category')}</InputLabel>
                <Select
                  value={category}
                  label={t('shopping.category')}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {t(`shopping.categories.${c}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Button type="submit" variant="contained" disabled={isPending || !category} fullWidth>
                {isPending ? t('common.saving') : t('shopping.add')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}
