import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import SingleMeal from './SingleMeal';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { Restaurant, Search, Category, FilterList } from '@mui/icons-material';

export default function MealView() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [mealName, setMealName] = useState('');
  const [mealCategory, setMealCategory] = useState('Obiad');
  const [mealType, setMealType] = useState('All');

  const labelIdCategory = "meal-category-select";
  const labelIdType = "meal-type-select";

  // 🍽️ Pobierz listę kategorii i typów posiłków
  const { data: mealCategoryList = [] } = useQuery({
    queryKey: ['mealCategories'],
    queryFn: REST.getMealCategoryList,
  });

  const { data: mealTypeList = [] } = useQuery({
    queryKey: ['mealTypes'],
    queryFn: REST.getMealTypeList,
  });

  // 🥗 Pobierz posiłki na podstawie filtrów
  const { data: mealList = [], isLoading, isError, error } = useQuery({
    queryKey: ['meals', mealCategory, mealType, mealName],
    queryFn: () => REST.getMealList(mealCategory, mealType, mealName, 'ALL', 'name', false),
    enabled: !!mealCategory && !!mealType // upewnij się że są dostępne
  });

  const handleChange = (event, field) => {
    const value = event.target.value;

    switch(field) {
      case 'mealName':
        setMealName(value);
        break;
      case 'mealCategory':
        setMealCategory(value);
        break;
      case 'mealType':
        setMealType(value);
        break;
      default:
        break;
    }
  };

  if (isError) {
    return (
      <CenteredContainer>
        <Card elevation={6} sx={{ borderRadius: 3, p: 3, maxWidth: 600 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Error: {error?.message || 'Unknown error'}
            </Typography>
          </CardContent>
        </Card>
      </CenteredContainer>
    );
  }

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
                <Restaurant sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Przeglądaj Posiłki
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Znajdź idealne posiłki dopasowane do Twoich potrzeb
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Section */}
        <Grid xs={12} md={12}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Search sx={{ color: '#2196f3', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Wyszukaj Posiłek
                </Typography>
              </Box>
              <TextField
                fullWidth
                label={t('food.meal')}
                value={mealName}
                onChange={(event) => handleChange(event, 'mealName')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Filters Section */}
        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Category sx={{ color: '#ff9800', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Kategoria Posiłku
                </Typography>
              </Box>
              {mealCategoryList.length > 0 && 
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={labelIdCategory}>{t('food.mealCategory')}</InputLabel>
                  <Select
                    labelId={labelIdCategory}
                    value={mealCategory}
                    onChange={(event) => handleChange(event, 'mealCategory')}
                    label={t('food.mealCategory')}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {mealCategoryList.map((cat, index) => (
                      <MenuItem key={index} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FilterList sx={{ color: '#9c27b0', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Typ Posiłku
                </Typography>
              </Box>
              {mealTypeList.length > 0 && 
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={labelIdType}>{t('food.mealType')}</InputLabel>
                  <Select
                    labelId={labelIdType}
                    value={mealType}
                    onChange={(event) => handleChange(event, 'mealType')}
                    label={t('food.mealType')}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {mealTypeList.map((type, index) => (
                      <MenuItem key={index} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid xs={12}>
          <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {mealList.map((meal, index) => (
                    <Grid key={index} xs={12} md={6}>
                      <SingleMeal meal={meal} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}