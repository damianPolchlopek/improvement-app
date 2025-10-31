import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import REST from '../utils/REST';

export function useDietCalculation() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const calculateDiet = useMutation({
    mutationFn: (meals) => {
      console.log('Before calculation:', meals);

      const mealsWithAmounts = meals.map(meal => ({
        ...meal,
        mealRecipeId: meal.id,
        portionMultiplier: meal.portionMultiplier || 1,

        ingredients: (meal.ingredients || []).map(mealIngredient => ({
          ...mealIngredient,
          mealRecipeIngredientId: mealIngredient.id,
        }))
      }));
      
      console.log('Calculating diet with meals:', mealsWithAmounts);

      return REST.calculateDiet({ dailyMeals: mealsWithAmounts });
    },
    onError: () => {
      showSnackbar(t('food.failedCalculateDiet'), 'error');
    }
  });

  return { calculateDiet };
}