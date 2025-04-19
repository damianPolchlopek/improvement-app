import React, { useState, useCallback } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

import DaySummary from './MealsDaySummary';
import MealsTable from './MealsTable';
import Grid from '@mui/material/Unstable_Grid2';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function AddDietDayView() {
  const [dietSummary, setDietSummary] = useState({
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isSelected = (id) => selected.includes(id);

  // Mutation: calculate diet
  const calculateDietMutation = useMutation({
    mutationFn: (selectedIds) => REST.calculateDiet(selectedIds),
    onSuccess: (response) => {
      setDietSummary(response.entity);
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: t('errors.calculateDiet'),
        severity: 'error',
      });
    }
  });

  // Mutation: add diet summary
  const addDietSummaryMutation = useMutation({
    mutationFn: (selectedIds) => REST.addDietSummary(selectedIds),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: t('food.dietSavedSuccessfully'),
        severity: 'success',
      });
      navigate('/food/statistics');
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: t('food.failedAddDietSummary'),
        severity: 'error',
      });
    }
  });

  const handleAddMealToDiet = useCallback((event, id) => {
    const newSelected = new Set(selected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    const newSelectedArray = Array.from(newSelected);
    setSelected(newSelectedArray);

    calculateDietMutation.mutate(newSelectedArray);
  }, [selected]);

  const handleSave = () => {
    addDietSummaryMutation.mutate(selected);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <DaySummary dietSummary={dietSummary} />
        </Grid>

        <Grid xs={12}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={addDietSummaryMutation.isLoading}
            startIcon={
              addDietSummaryMutation.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : null
            }
          >
            {t('food.saveDietDay')}
          </Button>
        </Grid>

        <Grid xs={12}>
          <MealsTable
            isSelected={isSelected}
            handleClick={handleAddMealToDiet}
          />
        </Grid>
      </Grid>
      
      {/* Mozna usunac w przyszlosci, jak mamy przekierowanie to nie zdazy sie pokazac */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CenteredContainer>
  );
}
