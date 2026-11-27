import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../utils/REST';
import REST from '../../utils/REST';
import { MealSelectionProvider, useMealSelection } from '../../context/MealSelectionContext';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';
import { Button, CircularProgress } from '@mui/material';
import { AddCircleOutlined, Save } from '@mui/icons-material';

// Własny stan wyboru posiłków na każde wejście w widok: nic nie przechodzi
// z edycji innego dnia ani z poprzedniego (zapisanego) dodawania.
export default function AddDietDayView() {
  return (
    <MealSelectionProvider>
      <AddDietDayContent />
    </MealSelectionProvider>
  );
}

function AddDietDayContent() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { selectedMeals } = useMealSelection();

  const createDietSummaryMutation = useMutation({
    mutationFn: () => {
      const dietDayToSave = {
        meals: selectedMeals.map((meal) => ({
          ...meal,
          mealRecipeId: meal.id,
          portionMultiplier: meal.amount || 1,

          ingredients: (meal.ingredients || []).map((mealIngredient) => ({
            ...mealIngredient,
            mealRecipeIngredientId: mealIngredient.id,
          })),
        })),
      };
      return REST.createDietSummary(dietDayToSave);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-summaries'] });
      showSnackbar(t('food.dietDaySaved'), 'success');
      navigate('/app/food/statistics');
    },
    onError: () => {
      showSnackbar(t('food.failedAddDietSummary'), 'error');
    },
  });

  const handleSave = () => {
    if (selectedMeals.length === 0) {
      showSnackbar(t('food.noMealsSelected'), 'warning');
      return;
    }

    createDietSummaryMutation.mutate();
  };

  return (
    <DietDaySummaryForm
      icon={<AddCircleOutlined />}
      title={t('food.addDietDay')}
      description={t('food.addDietDayDesc')}
    >
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={createDietSummaryMutation.isPending || selectedMeals.length === 0}
        startIcon={
          createDietSummaryMutation.isPending ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <Save />
          )
        }
      >
        {t('food.saveDietDay')}
      </Button>
    </DietDaySummaryForm>
  );
}
