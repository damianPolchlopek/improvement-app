import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import REST from '../../../utils/REST';
import CenteredContainer from '../../../component/CenteredContainer';
import DaySummary from './MealsDaySummary';
import MealsTable from './MealsTable';
import Grid from '@mui/material/Unstable_Grid2';

import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../../../component/SnackbarProvider';

export default function EditDietDayView({ children, initialSelected, onSelectionChange }) {
  const [dietSummary, setDietSummary] = useState({
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });
  const [selected, setSelected] = useState(initialSelected || []);

  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();


  const isSelected = (id) => {
    // console.log('isSelected', id, selected);

    return selected
      .map(meal => meal.id)
      .includes(id);
  }

  useEffect(() => {
    calculateDietMutation.mutate(initialSelected);
  }, []);

  const calculateDietMutation = useMutation({
    mutationFn: (eatenMeals) => REST.calculateDiet({eatenMeals}),
    onSuccess: (response) => {
      setDietSummary(response.entity);
      
      // showSnackbar( response.entity, 'error' );
    
    },
    onError: () => {
      showSnackbar( t('food.failedCalculateDiet'), 'error' );
    }
  });


  const handleAddMealToDiet = useCallback((event, meal) => {

    console.log('handleAddMealToDiet', event);

    const newSelected = new Set(selected);
    newSelected.has(meal) ? newSelected.delete(meal) : newSelected.add(meal);
    const newSelectedArray = Array.from(newSelected);
    
    // Aktualizujemy wewnętrzny stan
    setSelected(newSelectedArray);
    console.log('selected', selected);
    
    // Informujemy komponent nadrzędny o zmianie
    if (onSelectionChange) {
      onSelectionChange(newSelectedArray);
    }
    
    // Przeliczamy dietę
    calculateDietMutation.mutate(newSelectedArray);
  }, [selected, onSelectionChange]);


  
  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <DaySummary dietSummary={dietSummary} />
        </Grid>

        <Grid xs={12}>
            {children}
        </Grid>

        <Grid xs={12}>
          <MealsTable
            isSelected={isSelected}
            handleClick={handleAddMealToDiet}
          />
        </Grid>
      </Grid>
    </CenteredContainer>
  );
}
