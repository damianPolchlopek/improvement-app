import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Button,
  CircularProgress
} from '@mui/material';

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { queryClient } from '../../utils/REST';

import Snackbar from '../../component/Snackbar';
import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';

export default function EditDietDayView() {
  const mealsDietDay = useLoaderData();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { t } = useTranslation();
  const navigate = useNavigate();

  // setSelect obecnie jest w Komponencie glownym i podrzednym - niezbyt dobra implementacja
  // do pomyslenia jak to bedzie mozna zrobic lepiej
  const [selected, setSelected] = useState();
 
  useEffect(() => {
    setSelected(mealsDietDay.entity.meals.map((meal) => meal.id));
  }, [mealsDietDay]);

  // Mutation: edit diet summary
  const updateDietSummaryMutation = useMutation({
    mutationFn: (selectedIds) => REST.updateDietSummary(selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      navigate('/food/statistics');
      setSnackbar({
        open: true,
        message: t('food.faileUpdateDietSummary'),
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: t('food.failedUpdateDietSummary'),
        severity: 'error',
      });
    }
  });

  const handleUpdate = () => {
    const objectToUpdate = {
      dietSummaryId: mealsDietDay.entity.id,
      meals: selected
    };

    updateDietSummaryMutation.mutate(objectToUpdate);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    selected && <>
      <DietDaySummaryForm 
        initialSelected={selected}
        onSelectionChange={setSelected}
      >
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={updateDietSummaryMutation.isLoading}
          startIcon={
            updateDietSummaryMutation.isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null
          }
        >
          {t('food.updateDietDay')}
        </Button>
      </DietDaySummaryForm>

      <Snackbar
        open={snackbar.open}
        severity={snackbar.severity} 
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </>
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
