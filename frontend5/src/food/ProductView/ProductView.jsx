import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Skeleton, Typography } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';

import REST from '../../utils/REST';
import DataTable from '../../component/table/DataTable';
import FoodPageHeader from '../component/FoodPageHeader';
import SearchField from '../component/SearchField';
import { surfaceSx, foodTableSx } from '../component/foodStyles';
import { MACRO_COLORS, formatMacro } from '../foodView/macroColors';

function MacroValue({ value, macro, unit = 'g' }) {
  return (
    <Typography
      component="span"
      variant="body2"
      sx={{ color: MACRO_COLORS[macro].text, fontWeight: 500 }}
    >
      {formatMacro(value)}
      {unit && (
        <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.25 }}>
          {unit}
        </Box>
      )}
    </Typography>
  );
}

export default function ProductView() {
  const { t } = useTranslation();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [typedProductName, setTypedProductName] = useState('');

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setTypedProductName(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const {
    data: productCategoryList = [],
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: REST.getProductCategoryList,
  });

  const selectedCategory = productCategoryList[categoryIndex] || 'ALL';

  const {
    data: productList = [],
    isLoading: isLoadingProducts,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ['products', selectedCategory, typedProductName],
    queryFn: () =>
      REST.getProductFiltredByCategoryAndName(selectedCategory, typedProductName || ' '),
    enabled: !!selectedCategory,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const categoryLabel = (category) =>
    category === 'ALL'
      ? t('food.all')
      : t(`food.productCategoryNames.${category}`, { defaultValue: category });

  const columns = [
    {
      key: 'name',
      label: t('food.name'),
      accessor: 'name',
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'kcal',
      label: t('food.kcal'),
      accessor: 'kcal',
      align: 'right',
      render: (value) => <MacroValue value={value} macro="kcal" unit="" />,
    },
    {
      key: 'protein',
      label: t('food.protein'),
      accessor: 'protein',
      align: 'right',
      render: (value) => <MacroValue value={value} macro="protein" />,
    },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      accessor: 'carbohydrates',
      align: 'right',
      render: (value) => <MacroValue value={value} macro="carbohydrates" />,
    },
    {
      key: 'fat',
      label: t('food.fat'),
      accessor: 'fat',
      align: 'right',
      render: (value) => <MacroValue value={value} macro="fat" />,
    },
    {
      key: 'amount',
      label: t('food.amount'),
      align: 'right',
      accessor: (row) => `${formatMacro(row.amount)} ${row.unit ?? ''}`.trim(),
      render: (value) => (
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {value}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Inventory2 />}
        title={t('food.productDatabase')}
        description={t('food.productDatabaseDesc')}
        statLabel={t('food.productsLabel')}
        statValue={productList.length}
        statLoading={isLoadingProducts}
        actions={
          <SearchField
            value={searchInput}
            onChange={setSearchInput}
            placeholder={t('food.enterProductName')}
          />
        }
      >
        {isLoadingCategories ? (
          [0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={90} height={32} sx={{ borderRadius: 4 }} />
          ))
        ) : isCategoryError ? (
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            {t('food.errorLoadingCategories')}: {categoryError?.message || t('food.unknownError')}
          </Typography>
        ) : (
          productCategoryList.map((category, index) => {
            const active = index === categoryIndex;
            return (
              <Chip
                key={category}
                label={categoryLabel(category)}
                clickable
                color={active ? 'primary' : 'default'}
                variant={active ? 'filled' : 'outlined'}
                onClick={() => setCategoryIndex(index)}
                sx={{ fontWeight: active ? 600 : 400 }}
              />
            );
          })
        )}
      </FoodPageHeader>

      <Box sx={surfaceSx}>
        <DataTable
          data={productList}
          columns={columns}
          isLoading={isLoadingProducts}
          isError={isProductError}
          error={productError}
          loadingMessage={t('food.loadingProducts')}
          emptyMessage={
            typedProductName
              ? t('food.noProductsMatching', {
                  query: typedProductName,
                  category: categoryLabel(selectedCategory),
                })
              : t('food.noProductsInCategory', { category: categoryLabel(selectedCategory) })
          }
          containerProps={{
            component: 'div',
            elevation: 0,
            sx: { bgcolor: 'transparent', backgroundImage: 'none' },
          }}
          tableProps={{
            size: 'small',
            sx: {
              ...foodTableSx,
              '& .MuiTableCell-root': { px: 2, py: 1.1 },
              '& tbody .MuiTableRow-root:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
            },
          }}
        />
      </Box>
    </Box>
  );
}
