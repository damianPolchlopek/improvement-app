import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import DataTable from '../../component/table/DataTable';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Paper,
  Tab,
  Tabs,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import TabPanel from '../component/TabPanel';

export default function ProductView() {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [typedProductName, setTypedProductName] = useState(' ');

  // Fetch category list
  const {
    data: productCategoryList = [],
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: REST.getProductCategoryList
  });

  const selectedCategory = productCategoryList[tabIndex] || 'ALL';

  // Fetch product list for selected category and typed name
  const {
    data: productList = [],
    isLoading: isLoadingProducts,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ['products', selectedCategory, typedProductName],
    queryFn: () => REST.getProductFiltredByCategoryAndName(selectedCategory, typedProductName),
    select: (res) => res.entity,
    enabled: !!selectedCategory,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleProductTyped = (e) => {
    setTypedProductName(e.target.value);
  };

  // Definicja kolumn dla DataTable
  const columns = [
    {
      key: 'name',
      label: t('food.name'),
      accessor: 'name'
    },
    {
      key: 'kcal',
      label: t('food.kcal'),
      accessor: 'kcal'
    },
    {
      key: 'protein',
      label: t('food.protein'),
      accessor: 'protein'
    },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      accessor: 'carbohydrates'
    },
    {
      key: 'fat',
      label: t('food.fat'),
      accessor: 'fat'
    },
    {
      key: 'amount',
      label: t('food.amount'),
      accessor: 'amount'
    },
    {
      key: 'unit',
      label: t('food.unit'),
      accessor: 'unit'
    }
  ];

  return (
    <CenteredContainer>
      <Grid container sx={{ width: '70%' }} spacing={2}>
        <Grid xs={12}>
          <CenteredContainer>
            <TextField
              sx={{ width: '40%' }}
              onChange={handleProductTyped}
              label={t('food.product')}
            />
          </CenteredContainer>
        </Grid>

        <Grid xs={12} sx={{ height: '30px' }} />

        <Grid xs={12}>
          <Paper>
            {isLoadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isCategoryError ? (
              <Box sx={{ p: 4 }}>
                <Typography color="error">
                  Error: {categoryError?.message || 'Unknown error'}
                </Typography>
              </Box>
            ) : (
              <>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="fullWidth"
                >
                  {productCategoryList.map((productCategory, index) => (
                    <Tab key={index} label={productCategory} />
                  ))}
                </Tabs>

                {productCategoryList.map((productCategory, index) => (
                  <TabPanel key={index} value={tabIndex} index={index}>
                    <DataTable
                      data={productList}
                      columns={columns}
                      isLoading={isLoadingProducts}
                      isError={isProductError}
                      error={productError}
                      loadingMessage={t('common.loading')}
                      emptyMessage={t('food.noProductsFound')}
                      containerProps={{ component: 'div' }} // Usuń Paper wrapper z DataTable
                    />
                  </TabPanel>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </CenteredContainer>
  );
}