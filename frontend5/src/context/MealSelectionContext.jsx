import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useDietCalculation } from './useDietCalculation';

// Create the context
const MealSelectionContext = createContext();

const EMPTY_SUMMARY = { kcal: 0, protein: 0, carbohydrates: 0, fat: 0 };

export function MealSelectionProvider({ children, initialSelected = [] }) {
  const [selectedMeals, setSelectedMeals] = useState(
    initialSelected.map((meal) => ({
      ...meal,
      amount: meal.amount || 1, // Ensure amount is always present
    }))
  );

  const [dietSummary, setDietSummary] = useState(EMPTY_SUMMARY);

  const { calculateDiet } = useDietCalculation();
  const { mutate: calculateDietMutate } = calculateDiet; // stabilna referencja (react-query)

  // Przelicz dietę, gdy zmienią się wybrane posiłki.
  // Reset do zer jest wartością pochodną (poniżej), więc tu nie ma synchronicznego setState.
  useEffect(() => {
    if (selectedMeals.length === 0) return;

    calculateDietMutate(selectedMeals, {
      onSuccess: (response) => setDietSummary(response),
    });
  }, [selectedMeals, calculateDietMutate]);

  // Gdy brak posiłków, pokazujemy zera bez dodatkowego setState/renderu
  const summary = selectedMeals.length > 0 ? dietSummary : EMPTY_SUMMARY;

  // Check if a meal is selected by ID
  const isMealSelected = useCallback(
    (mealId) => {
      return selectedMeals.some((meal) => meal.mealRecipeId === mealId);
    },
    [selectedMeals]
  );

  // Toggle meal selection with amount
  const toggleMealSelection = useCallback((meal, amount = 1) => {
    setSelectedMeals((prev) => {
      const existingIndex = prev.findIndex((item) => item.mealRecipeId === meal.mealRecipeId);

      // If meal exists, remove it
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      // Otherwise add it with amount
      else {
        return [
          ...prev,
          {
            ...meal,
            amount: parseInt(amount, 10) || 1,
          },
        ];
      }
    });
  }, []);

  // Update meal amount for already selected meal
  const updateMealAmount = useCallback((mealId, newAmount) => {
    const parsedAmount = parseFloat(newAmount) || 1;

    setSelectedMeals((prev) =>
      prev.map((meal) => (meal.mealRecipeId === mealId ? { ...meal, amount: parsedAmount } : meal))
    );
  }, []);

  const updateMealIngredient = useCallback((mealId, productId, newMealIngredientAmount) => {
    setSelectedMeals((prev) =>
      prev.map((meal) =>
        meal.mealRecipeId === mealId
          ? {
              ...meal,
              ingredients: meal.ingredients.map((ingredient) =>
                ingredient.productId === productId
                  ? { ...ingredient, amount: newMealIngredientAmount }
                  : ingredient
              ),
            }
          : meal
      )
    );

    // call do backendu o rekalkulacje posilku
  }, []);

  // Reset all selections
  const clearSelections = useCallback(() => {
    setSelectedMeals([]);
  }, []);

  // Context value
  const value = {
    selectedMeals,
    setSelectedMeals,
    dietSummary: summary,
    isMealSelected,
    toggleMealSelection,
    updateMealAmount,
    updateMealIngredient,
    clearSelections,
  };

  return <MealSelectionContext.Provider value={value}>{children}</MealSelectionContext.Provider>;
}

// Custom hook to use meal selection context
export function useMealSelection() {
  const context = useContext(MealSelectionContext);
  if (!context) {
    throw new Error('useMealSelection must be used within a MealSelectionProvider');
  }

  return context;
}
