import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import {
  Box,
  Paper,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
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
    queryFn: REST.getProductCategoryList,
    select: (res) => res.entity,
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
                    {isLoadingProducts ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : isProductError ? (
                      <Typography color="error">
                        Error: {productError?.message || 'Unknown error'}
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <StyledTableRow>
                              <StyledTableCell>{t('food.name')}</StyledTableCell>
                              <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                              <StyledTableCell>{t('food.protein')}</StyledTableCell>
                              <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                              <StyledTableCell>{t('food.fat')}</StyledTableCell>
                              <StyledTableCell>{t('food.amount')}</StyledTableCell>
                              <StyledTableCell>{t('food.unit')}</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {productList.map((product) => (
                              <StyledTableRow key={product.id}>
                                <StyledTableCell>{product.name}</StyledTableCell>
                                <StyledTableCell>{product.kcal}</StyledTableCell>
                                <StyledTableCell>{product.protein}</StyledTableCell>
                                <StyledTableCell>{product.carbohydrates}</StyledTableCell>
                                <StyledTableCell>{product.fat}</StyledTableCell>
                                <StyledTableCell>{product.amount}</StyledTableCell>
                                <StyledTableCell>{product.unit}</StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
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
