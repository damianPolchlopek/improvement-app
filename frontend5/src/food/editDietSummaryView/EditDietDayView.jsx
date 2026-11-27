import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import { Button, CircularProgress } from '@mui/material';
import { EditCalendar, Save } from '@mui/icons-material';

import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/snackbar/SnackbarProvider';
import { MealSelectionProvider, useMealSelection } from '../../context/MealSelectionContext';

// Stan wyboru startuje z posiłków edytowanego dnia i żyje tylko w tym widoku.
// key = id dnia: przejście do edycji innego dnia (ta sama trasa) zaczyna od nowa.
export default function EditDietDayView() {
  const mealsDietDay = useLoaderData();
  return (
    <MealSelectionProvider key={mealsDietDay.id} initialSelected={mealsDietDay.meals ?? []}>
      <EditDietDayContent mealsDietDay={mealsDietDay} />
    </MealSelectionProvider>
  );
}

function EditDietDayContent({ mealsDietDay }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { selectedMeals } = useMealSelection();

  // Mutation: edit diet summary
  const updateDietSummaryMutation = useMutation({
    mutationFn: () => {
      const objectToUpdate = {
        dietSummaryId: mealsDietDay.id,
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

      return REST.updateDietSummary(objectToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-summaries'] });
      navigate('/app/food/statistics');
      showSnackbar(t('food.updatedDietSummary'), 'success');
    },
    onError: () => {
      showSnackbar(t('food.failedUpdateDietSummary'), 'error');
    },
  });

  const handleUpdate = () => {
    updateDietSummaryMutation.mutate();
  };

  return (
    selectedMeals && (
      <>
        <DietDaySummaryForm
          icon={<EditCalendar />}
          title={t('food.editDietDay')}
          description={
            mealsDietDay.date ? t('food.editDietDayDesc', { date: mealsDietDay.date }) : null
          }
        >
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={updateDietSummaryMutation.isPending}
            startIcon={
              updateDietSummaryMutation.isPending ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Save />
              )
            }
          >
            {t('food.updateDietDay')}
          </Button>
        </DietDaySummaryForm>
      </>
    )
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
