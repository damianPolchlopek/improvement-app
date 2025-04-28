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

  const isSelected = (id) => selected.includes(id);

  useEffect(() => {
    calculateDietMutation.mutate(initialSelected);
  }, []);

  const calculateDietMutation = useMutation({
    mutationFn: (selectedIds) => REST.calculateDiet(selectedIds),
    onSuccess: (response) => {
      setDietSummary(response.entity);
    },
    onError: () => {
      showSnackbar( t('food.failedCalculateDiet'), 'error' );
    }
  });


  const handleAddMealToDiet = useCallback((event, id) => {
    const newSelected = new Set(selected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    const newSelectedArray = Array.from(newSelected);
    
    // Aktualizujemy wewnętrzny stan
    setSelected(newSelectedArray);
    
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
