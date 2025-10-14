import React from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  Card,
  CircularProgress
} from '@mui/material';

import {  
  Kitchen, 
} from '@mui/icons-material';

export default function TabPanelMealIngredients({ meal }) {
  const { t } = useTranslation();

  const { data: mealIngredients = [], isLoading } = useQuery({
    queryKey: ['mealIngredients', meal.id],
    queryFn: () => REST.getMealIngredients(meal.id),
  });

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Card elevation={6} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('messages.loading')}
          </Typography>
        </Card>
      </Box>
    );
  }

  if (Object.keys(mealIngredients).length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Kitchen sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {t('food.noProducts')}
        </Typography>
      </Box>
    )
  }

  const CATEGORY_ORDER = ['MEAT','DAIRY','CARBS','FAT', 'FRUIT_VEGETABLES', 'SPICES', 'SWEETS', 'OTHER'];

  return(
    <Box>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t('food.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('food.amount')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('food.unit')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CATEGORY_ORDER.map(cat => {
              const ingredientCategory = mealIngredients[cat] || [];
              return (
                ingredientCategory?.map((ingredient, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'blue' }
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{ingredient.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={ingredient.amount} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ingredient.unit} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
              )))
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
