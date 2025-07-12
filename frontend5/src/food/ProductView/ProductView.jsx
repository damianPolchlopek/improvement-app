import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
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
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  Chip,
  IconButton
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import TabPanel from '../component/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ClearIcon from '@mui/icons-material/Clear';

export default function ProductView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [typedProductName, setTypedProductName] = useState('');

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
    queryFn: () => REST.getProductFiltredByCategoryAndName(selectedCategory, typedProductName || ' '),
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

  const handleClearSearch = () => {
    setTypedProductName('');
  };

  // Definicja kolumn dla DataTable
  const columns = [
    {
      key: 'name',
      label: t('food.name'),
      accessor: 'name',
      render: (value) => (
        <Typography variant="body2" fontWeight="600" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          {value}
        </Typography>
      )
    },
    {
      key: 'kcal',
      label: t('food.kcal'),
      accessor: 'kcal',
      align: 'right',
      render: (value) => (
        <Chip 
          label={value} 
          color="warning" 
          variant="outlined" 
          size="small" 
        />
      )
    },
    {
      key: 'protein',
      label: t('food.protein'),
      accessor: 'protein',
      align: 'right',
      render: (value) => (
        <Chip 
          label={`${value}g`} 
          color="success" 
          variant="outlined" 
          size="small" 
        />
      )
    },
    {
      key: 'carbohydrates',
      label: t('food.carbs'),
      accessor: 'carbohydrates',
      align: 'right',
      render: (value) => (
        <Chip 
          label={`${value}g`} 
          color="info" 
          variant="outlined" 
          size="small" 
        />
      )
    },
    {
      key: 'fat',
      label: t('food.fat'),
      accessor: 'fat',
      align: 'right',
      render: (value) => (
        <Chip 
          label={`${value}g`} 
          color="secondary" 
          variant="outlined" 
          size="small" 
        />
      )
    },
    {
      key: 'amount',
      label: t('food.amount'),
      accessor: 'amount',
      align: 'right'
    },
    {
      key: 'unit',
      label: t('food.unit'),
      accessor: 'unit',
      align: 'center'
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>

        {/* Header Section */}
        <Grid xs={12}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <RestaurantMenuIcon sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Baza Produktów
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Przeglądaj i wyszukuj produkty spożywcze według kategorii
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Section */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Wyszukaj Produkt
                </Typography>
              </Box>
              <TextField
                fullWidth
                value={typedProductName}
                onChange={handleProductTyped}
                label={t('food.product')}
                placeholder="Wpisz nazwę produktu..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: typedProductName && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Section */}
        <Grid xs={12} md={6}>
          <Card elevation={4} sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #4caf50, #2e7d32)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="h3" fontWeight="700">
                {productList?.length || 0}
              </Typography>
              <Typography variant="body1">
                {typedProductName ? 'Znalezionych produktów' : 'Produktów w kategorii'}
              </Typography>
              {typedProductName && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  dla: "{typedProductName}"
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Categories and Products Section */}
        <Grid xs={12}>
          <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{
              p: 3,
              background: theme.palette.card.header,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <CategoryIcon sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Kategorie Produktów
              </Typography>
            </Box>

            {isLoadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2, ml: 2 }}>
                  Ładowanie kategorii...
                </Typography>
              </Box>
            ) : isCategoryError ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                  Błąd ładowania kategorii
                </Typography>
                <Typography color="error" variant="body2">
                  {categoryError?.message || 'Nieznany błąd'}
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
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      minHeight: 60,
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)'
                      },
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        fontWeight: 700
                      }
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0'
                    }
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
                        loadingMessage="Ładowanie produktów..."
                        emptyMessage={
                          typedProductName 
                            ? `Brak produktów zawierających "${typedProductName}" w kategorii ${productCategory}`
                            : `Brak produktów w kategorii ${productCategory}`
                        }
                        containerProps={{ 
                          component: 'div',
                          elevation: 0,
                          sx: { 
                            backgroundColor: 'transparent',
                            '& .MuiTableContainer-root': {
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider'
                            }
                          }
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