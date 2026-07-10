import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import DataTable from '../../component/table/DataTable';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Tab,
  Tabs,
  TextField,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Toolbar,
  useTheme,
  Chip,
  IconButton,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import TabPanel from '../component/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import ClearIcon from '@mui/icons-material/Clear';

export default function ProductView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [typedProductName, setTypedProductName] = useState('');

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setTypedProductName(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Fetch category list
  const {
    data: productCategoryList = [],
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: REST.getProductCategoryList,
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
    queryFn: () =>
      REST.getProductFiltredByCategoryAndName(selectedCategory, typedProductName || ' '),
    enabled: !!selectedCategory,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Definicja kolumn dla DataTable
  const columns = [
    {
      key: 'name',
      label: t('food.name'),
      accessor: 'name',
      render: (value) => (
        <Typography
          variant="body2"
          fontWeight="600"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      key: 'kcal',
      label: t('food.kcal'),
      accessor: 'kcal',
      align: 'right',
      render: (value) => <Chip label={value} color="warning" variant="outlined" size="small" />,
    },
    {
      key: 'protein',
      label: t('food.protein'),
      accessor: 'protein',
      align: 'right',
      render: (value) => (
        <Chip label={`${value}g`} color="success" variant="outlined" size="small" />
      ),
    },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      accessor: 'carbohydrates',
      align: 'right',
      render: (value) => <Chip label={`${value}g`} color="info" variant="outlined" size="small" />,
    },
    {
      key: 'fat',
      label: t('food.fat'),
      accessor: 'fat',
      align: 'right',
      render: (value) => (
        <Chip label={`${value}g`} color="secondary" variant="outlined" size="small" />
      ),
    },
    {
      key: 'amount',
      label: t('food.amount'),
      accessor: 'amount',
      align: 'right',
    },
    {
      key: 'unit',
      label: t('food.unit'),
      accessor: 'unit',
      align: 'center',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'text.primary',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <RestaurantMenuIcon sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('food.productDatabase')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('food.productDatabaseDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <Toolbar
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 2,
                rowGap: 1.5,
                py: 1.5,
                minHeight: 'auto',
              }}
            >
              <TextField
                size="small"
                placeholder={t('food.enterProductName')}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                sx={{ minWidth: 220 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="clear search"
                        onClick={() => setSearchInput('')}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {typedProductName
                  ? t('food.forQuery', { query: typedProductName })
                  : t('food.productsInCategory')}
                {': '}
                <Typography component="span" variant="subtitle1" fontWeight="600">
                  {productList?.length || 0}
                </Typography>
              </Typography>
            </Toolbar>
          </Card>
        </Grid>

        {/* Categories and Products Section */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
              <CategoryIcon sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('food.productCategories')}
              </Typography>
            </Box>

            {isLoadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2, ml: 2 }}>
                  {t('food.loadingCategories')}
                </Typography>
              </Box>
            ) : isCategoryError ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                  {t('food.errorLoadingCategories')}
                </Typography>
                <Typography color="error" variant="body2">
                  {categoryError?.message || t('food.unknownError')}
                </Typography>
              </Box>
            ) : (
              <>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minHeight: 44,
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      minHeight: 44,
                      fontSize: '0.95rem',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                      },
                    },
                  }}
                >
                  {productCategoryList.map((productCategory, index) => (
                    <Tab
                      key={index}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon sx={{ fontSize: 18 }} />
                          {productCategory}
                        </Box>
                      }
                    />
                  ))}
                </Tabs>

                {productCategoryList.map((productCategory, index) => (
                  <TabPanel key={index} value={tabIndex} index={index}>
                    <Box sx={{ p: 2 }}>
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
                                category: productCategory,
                              })
                            : t('food.noProductsInCategory', { category: productCategory })
                        }
                        containerProps={{
                          component: 'div',
                          elevation: 0,
                          sx: {
                            backgroundColor: 'transparent',
                            '& .MuiTableContainer-root': {
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                            },
                          },
                        }}
                      />
                    </Box>
                  </TabPanel>
                ))}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
