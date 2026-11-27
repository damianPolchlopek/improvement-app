import React, { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Skeleton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

import REST from '../utils/REST';
import ErrorAlert from '../component/error/ErrorAlert';
import FoodPageHeader from '../food/component/FoodPageHeader';
import ShoppingForm from './ShoppingForm';
import ShoppingItemsTable from './ShoppingItemsTable';
import { categoryColor } from './shoppingCategories';

const ALL = 'ALL';

export default function ShoppingListPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t } = useTranslation();

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

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1000, mx: 'auto' }}>
      <FoodPageHeader
        icon={<ShoppingCart />}
        title={t('shopping.title')}
        description={t('shopping.subtitle')}
        statLabel={t('shopping.itemsInCategory')}
        statValue={itemsList.length}
        statLoading={categoriesLoading || itemsLoading}
      >
        {categoriesLoading
          ? [0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" width={90} height={32} sx={{ borderRadius: 4 }} />
            ))
          : categories.map((category) => {
              const active = category === effectiveCategory;
              const colors = category === ALL ? null : categoryColor(category);
              return (
                <Chip
                  key={category}
                  label={t(`shopping.categories.${category}`)}
                  clickable
                  variant={active ? 'filled' : 'outlined'}
                  color={active && !colors ? 'primary' : 'default'}
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  icon={
                    colors ? (
                      <Box
                        component="span"
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.dot }}
                      />
                    ) : undefined
                  }
                  sx={{
                    fontWeight: active ? 600 : 400,
                    '& .MuiChip-icon': { ml: 1.25, mr: -0.25 },
                    ...(active && colors
                      ? {
                          bgcolor: colors.bg,
                          color: colors.text,
                          '&:hover': { bgcolor: colors.bg },
                        }
                      : {}),
                  }}
                />
              );
            })}
      </FoodPageHeader>

      {isCategoriesError || isError ? (
        <ErrorAlert error={categoriesError || error} />
      ) : (
        <>
          <ShoppingForm
            categories={itemCategories}
            defaultCategory={effectiveCategory === ALL ? '' : effectiveCategory}
          />
          <ShoppingItemsTable
            items={itemsList}
            showCategory={effectiveCategory === ALL}
            title={effectiveCategory ? t(`shopping.categories.${effectiveCategory}`) : ''}
            isLoading={categoriesLoading || itemsLoading}
          />
        </>
      )}
    </Box>
  );
}
