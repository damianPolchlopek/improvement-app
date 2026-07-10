import React, { useEffect, useState } from 'react';
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
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { Restaurant, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export default function MealView() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [mealName, setMealName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [mealCategory, setMealCategory] = useState('Obiad');
  const [mealType, setMealType] = useState('All');

  const labelIdCategory = 'meal-category-select';
  const labelIdType = 'meal-type-select';

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setMealName(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // 🍽️ Pobierz listę kategorii i typów posiłków
  const { data: mealCategoryList = [] } = useQuery({
    queryKey: ['mealCategories'],
    queryFn: REST.getMealCategoryList,
  });

  const { data: mealTypeList = [] } = useQuery({
    queryKey: ['mealTypes'],
    queryFn: REST.getMealTypeList,
  });

  const {
    data: mealList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['meals', mealCategory, mealType, mealName],
    queryFn: () => REST.getMealList(mealCategory, mealType, mealName, 'ALL', 'name', false),
    enabled: !!mealCategory && !!mealType, // upewnij się że są dostępne
    staleTime: 1000 * 60 * 5,
  });

  const handleChange = (event, field) => {
    const value = event.target.value;

    switch (field) {
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
              {t('food.error')}: {error?.message || t('food.unknownError')}
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
                <Restaurant sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('food.browseMeals')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('food.browseMealsDesc')}
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
                placeholder={t('food.searchMeal')}
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

              {mealCategoryList.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id={labelIdCategory}>{t('food.mealCategory')}</InputLabel>
                  <Select
                    labelId={labelIdCategory}
                    value={mealCategory}
                    onChange={(event) => handleChange(event, 'mealCategory')}
                    label={t('food.mealCategory')}
                  >
                    {mealCategoryList.map((cat, index) => (
                      <MenuItem key={index} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {mealTypeList.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id={labelIdType}>{t('food.mealType')}</InputLabel>
                  <Select
                    labelId={labelIdType}
                    value={mealType}
                    onChange={(event) => handleChange(event, 'mealType')}
                    label={t('food.mealType')}
                  >
                    {mealTypeList.map((type, index) => (
                      <MenuItem key={index} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Toolbar>
          </Card>
        </Grid>

        {/* Results */}
        <Grid size={12}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={40} />
            </Box>
          ) : mealList.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">{t('food.noMealsFound')}</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {mealList.map((meal, index) => (
                <Grid key={index} size={{ xs: 12, md: 6 }}>
                  <SingleMeal meal={meal} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
