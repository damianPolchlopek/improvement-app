import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import SingleMeal from './SingleMeal';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

export default function MealView() {
  const { t } = useTranslation();

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
        <p>Error: {error?.message || 'Unknown error'}</p>
      </CenteredContainer>
    );
  }

  return (
    <>
      <Container
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // wyśrodkowanie poziome
          width: '100%',
        }}
      >
        {/* Rząd 1 – wyszukiwarka */}
        <Grid container sx={{ maxWidth: 800, width: '100%' }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('food.meal')}
              value={mealName}
              onChange={(event) => handleChange(event, 'mealName')}
            />
          </Grid>
        </Grid>

        {/* Rząd 2 – kategoria i typ */}
        <Grid container sx={{ mt: 1, maxWidth: 800, width: '100%' }}>
          <Grid item xs={12} sm={6}>
            {mealCategoryList.length > 0 && 
            <FormControl fullWidth variant="standard">
              <InputLabel id={labelIdCategory}>{t('food.mealCategory')}</InputLabel>
              <Select
                labelId={labelIdCategory}
                value={mealCategory}
                onChange={(event) => handleChange(event, 'mealCategory')}
              >
                {mealCategoryList.map((cat, index) => (
                  <MenuItem key={index} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>}
          </Grid>

          <Grid item xs={12} sm={6}>
            {mealTypeList.length > 0 && 
            <FormControl fullWidth variant="standard">
              <InputLabel id={labelIdType}>{t('food.mealType')}</InputLabel>
              <Select
                labelId={labelIdType}
                value={mealType}
                onChange={(event) => handleChange(event, 'mealType')}
              >
                {mealTypeList.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>}
          </Grid>
        </Grid>
      </Container>

      {
        isLoading ? 
          <CircularProgress sx={{ mt: 2 }} /> : 
          <CenteredContainer>
            <Grid container rowSpacing={1} columnSpacing={1} sx={{width: '80%'}}>
              {mealList.map((meal, index) =>
                <Grid key={index} xs={6}>
                  <SingleMeal meal={meal}/>
                </Grid>
              )}
            </Grid>
          </CenteredContainer>
        }
    </>
  );
}
