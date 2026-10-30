import React, { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Toolbar,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ShoppingCart, ListAlt } from '@mui/icons-material';

import PageLoader from '../component/loader/PageLoader';
import ErrorAlert from '../component/error/ErrorAlert';
import ShoppingForm from './ShoppingForm';
import ShoppingItemsTable from './ShoppingItemsTable';

const ALL = 'ALL';

export default function ShoppingListPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ['shopping-categories'],
    queryFn: () => REST.getAllCategoryProducts(),
  });

  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  // "ALL" to tylko filtr listy — produktu nie da się do niego przypisać
  const itemCategories = useMemo(() => categories.filter((c) => c !== ALL), [categories]);

  const effectiveCategory = selectedCategory || categories[0] || '';

  const {
    data: items,
    isLoading: itemsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shopping-list', effectiveCategory],
    queryFn: () => REST.getShoppingListByCategory(effectiveCategory),
    enabled: !!effectiveCategory,
    placeholderData: keepPreviousData,
  });

  const itemsList = items || [];

  if (categoriesLoading) {
    return <PageLoader text={t('messages.loading')} />;
  }

  if (isCategoriesError || isError) {
    return <ErrorAlert error={categoriesError || error} />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'text.primary',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ShoppingCart sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('shopping.title')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('shopping.subtitle')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters + stats */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <Toolbar
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 1.5,
                py: 1.5,
                minHeight: 'auto',
              }}
            >
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>{t('shopping.selectCategory')}</InputLabel>
                <Select
                  value={effectiveCategory}
                  label={t('shopping.selectCategory')}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {t(`shopping.categories.${category}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" alignItems="center" gap={1}>
                <ListAlt fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('shopping.itemsInCategory')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {itemsLoading ? '...' : itemsList.length}
                </Typography>
              </Box>
            </Toolbar>
          </Card>
        </Grid>

        {/* Add form */}
        <Grid size={12}>
          <ShoppingForm
            categories={itemCategories}
            defaultCategory={effectiveCategory === ALL ? '' : effectiveCategory}
          />
        </Grid>

        {/* Table Section */}
        <Grid size={12}>
          {itemsLoading ? (
            <PageLoader text={t('messages.loading')} />
          ) : (
            <ShoppingItemsTable items={itemsList} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
