import { useEffect } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Button,
  CircularProgress
} from '@mui/material';

import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { useMealSelection } from '../../context/MealSelectionContext';

export default function EditDietDayView() {
  const mealsDietDay = useLoaderData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { selectedMeals, setSelectedMeals } = useMealSelection();

 
  useEffect(() => {
    setSelectedMeals(mealsDietDay.meals);
  }, [mealsDietDay]);

  // Mutation: edit diet summary
  const updateDietSummaryMutation = useMutation({
    mutationFn: (selectedIds) => REST.updateDietSummary(selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      navigate('/app/food/statistics');
      showSnackbar( t('food.updatedDietSummary'), 'success' );
    },
    onError: () => {
      showSnackbar( t('food.failedUpdateDietSummary'), 'error' );
    }
  });

  const handleUpdate = () => {
    const objectToUpdate = {
      dietSummaryId: mealsDietDay.id,
      meals: selectedMeals
    };

    updateDietSummaryMutation.mutate(objectToUpdate);
  };

  return (
    selectedMeals && <>
      <DietDaySummaryForm>
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
