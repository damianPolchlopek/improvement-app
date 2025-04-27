import React, { useState, useCallback, useEffect } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';

import DaySummary from '../addDietDay/MealsDaySummary';
import MealsTable from '../addDietDay/MealsTableForm';
import Grid from '@mui/material/Unstable_Grid2';

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { queryClient } from '../../utils/REST';

export default function EditDietDayView() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dietSummary, setDietSummary] = useState({
      kcal: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    });
    const [selected, setSelected] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const mealsDietDay = useLoaderData();
  
    const isSelected = (id) => selected.includes(id);
  // Mutation: calculate diet

  useEffect(() => {

    console.log('mealsDietDay:', mealsDietDay);
    console.log('mealsDietDay.kcal:', mealsDietDay.entity.kcal);
    console.log('mealsDietDay.protein:', mealsDietDay.protein);
    console.log('mealsDietDay.carbohydrates:', mealsDietDay.carbohydrates);
    console.log('mealsDietDay.fat:', mealsDietDay.fat);
    console.log('mealsDietDay.selected:', mealsDietDay.selected);

    setDietSummary({
      kcal: mealsDietDay.kcal,
      protein: mealsDietDay.protein,
      carbohydrates: mealsDietDay.carbohydrates,
      fat: mealsDietDay.fat,
    });
    
  }, []);

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
      queryClient.invalidateQueries(['diet-summaries']);
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

      <Typography>
       www
      </Typography>
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
          <Typography variant="h6" gutterBottom>
            Edit Form
          </Typography>
          <MealsTable
            isSelected={isSelected}
            handleClick={handleAddMealToDiet}
          />
        </Grid>
      </Grid>
      
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

export async function loader({ params }) {
  try {
    const data = await REST.getDietSummariesById(params.id);
    return data;
  } catch (error) {
    console.error('Error loading diet summaries:', error);
    throw new Response('Failed to load diet summaries', { status: 500 });
  }
}
