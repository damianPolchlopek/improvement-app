import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import { useMealSelection } from '../../context/MealSelectionContext';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';
import { Button, CircularProgress } from '@mui/material';

export default function AddDietDayView() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { selectedMeals } = useMealSelection();

  const createDietSummaryMutation = useMutation({
    mutationFn: () => {
      console.log('Selected meals:', selectedMeals);
      const dietDayToSave = { 
        meals: selectedMeals.map(meal => ({
          ...meal,
          amount: meal.amount || 1
        }))
      };
      
      return REST.createDietSummary(dietDayToSave);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      showSnackbar(t('food.dietDaySaved'), 'success');
      navigate('/app/food/statistics');
    },
    onError: () => {
      showSnackbar(t('food.failedAddDietSummary'), 'error');
    }
  });

  const handleSave = () => {
    if (selectedMeals.length === 0) {
      showSnackbar(t('food.noMealsSelected'), 'warning');
      return;
    }
    
    createDietSummaryMutation.mutate();
  };

  return (
    <DietDaySummaryForm>
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={createDietSummaryMutation.isLoading || selectedMeals.length === 0}
        startIcon={
          createDietSummaryMutation.isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : null
        }
      >
        {t('food.saveDietDay')}
      </Button>
    </DietDaySummaryForm>
  );
}