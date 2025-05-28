import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../component/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import REST from '../utils/REST';

export function useMealRecalculation() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const recalculateMeal = useMutation({
    mutationFn: (eatenMeal) => REST.recalculateMealMacro({ eatenMeal }),
    onError: () => {
      showSnackbar(t('food.failedCalculateDiet'), 'error');
    }
  });

  return { recalculateMeal };
}