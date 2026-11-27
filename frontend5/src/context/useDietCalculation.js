import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../component/snackbar/SnackbarProvider';
import { useTranslation } from 'react-i18next';
import REST from '../utils/REST';

const DEBOUNCE_MS = 300;

// Payload dla backendu — jednocześnie klucz zapytania, więc wynik jest zawsze
// przypisany do konkretnego zestawu posiłków (stara odpowiedź nie nadpisze nowszej).
function toDailyMeals(meals) {
  return meals.map((meal) => ({
    ...meal,
    amount: meal.amount || 1,
    mealRecipeId: meal.id,
    portionMultiplier: meal.amount || 1,

    ingredients: (meal.ingredients || []).map((mealIngredient) => ({
      ...mealIngredient,
      mealRecipeIngredientId: mealIngredient.id,
    })),
  }));
}

/**
 * Podsumowanie makro dla wybranych posiłków.
 * Debounce: szybka zmiana porcji nie odpytuje backendu na każdy znak.
 * keepPreviousData: w trakcie przeliczania widać poprzedni wynik zamiast zer.
 * Powrót do wcześniejszego zestawu posiłków trafia w cache.
 */
export function useDietCalculation(selectedMeals) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [debouncedMeals, setDebouncedMeals] = useState(selectedMeals);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedMeals(selectedMeals), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [selectedMeals]);

  const dailyMeals = toDailyMeals(debouncedMeals);

  const query = useQuery({
    queryKey: ['diet-calculation', dailyMeals],
    // Komunikat w queryFn (nie w efekcie): dokładnie jeden snackbar na nieudany request
    queryFn: () =>
      REST.calculateDiet({ dailyMeals }).catch((error) => {
        showSnackbar(t('food.failedCalculateDiet'), 'error');
        throw error;
      }),
    enabled: dailyMeals.length > 0,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    retry: false,
  });

  return query;
}
