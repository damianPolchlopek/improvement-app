import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../component/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import REST from '../utils/REST';

export function useDietCalculation() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const calculateDiet = useMutation({
    mutationFn: (meals) => {
      const mealsWithAmounts = meals.map(meal => ({
        ...meal,
        amount: meal.amount || 1
      }));
      
      console.log('Calculating diet with meals:', mealsWithAmounts);
      return REST.calculateDiet({ eatenMeals: mealsWithAmounts });
    },
    onError: () => {
      showSnackbar(t('food.failedCalculateDiet'), 'error');
    }
  });

  return { calculateDiet };
}