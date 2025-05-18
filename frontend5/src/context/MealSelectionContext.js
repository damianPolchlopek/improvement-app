import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import REST from '../utils/REST';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../component/SnackbarProvider';
import { useTranslation } from 'react-i18next';

// Create the context
const MealSelectionContext = createContext();

export function MealSelectionProvider({ children, initialSelected = [] }) {
  const [selectedMeals, setSelectedMeals] = useState(
    initialSelected.map(meal => ({
      ...meal,
      amount: meal.amount || 1 // Ensure amount is always present
    }))
  );
  
  const [dietSummary, setDietSummary] = useState({
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
  });
  
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // Calculate diet mutation
  const calculateDietMutation = useMutation({
    mutationFn: (meals) => {
      // Format meals with amounts for API
      const mealsWithAmounts = meals.map(meal => ({
        ...meal,
        amount: meal.amount || 1
      }));
      
      return REST.calculateDiet({ eatenMeals: mealsWithAmounts });
    },
    onSuccess: (response) => {
      setDietSummary(response.entity);
    },
    onError: () => {
      showSnackbar( t('food.failedCalculateDiet'), 'error' );
    }
  });

  // Recalculate diet when selected meals change
  useEffect(() => {
    if (selectedMeals.length > 0) {
      calculateDietMutation.mutate(selectedMeals);
    } else {
      // Reset summary if no meals selected
      setDietSummary({
        kcal: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      });
    }
  }, [selectedMeals]);

  // Check if a meal is selected by ID
  const isMealSelected = useCallback((mealId) => {
    return selectedMeals.some(meal => meal.id === mealId);
  }, [selectedMeals]);

  // Toggle meal selection with amount
  const toggleMealSelection = useCallback((meal, amount = 1) => {
    setSelectedMeals(prev => {
      const existingIndex = prev.findIndex(item => item.id === meal.id);
      
      // If meal exists, remove it
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } 
      // Otherwise add it with amount
      else {
        return [...prev, { 
          ...meal, 
          amount: parseInt(amount, 10) || 1 
        }];
      }
    });
  }, []);

  // Update meal amount for already selected meal
  const updateMealAmount = useCallback((mealId, newAmount) => {
    const parsedAmount = parseInt(newAmount, 10) || 1;
    
    setSelectedMeals(prev => 
      prev.map(meal => 
        meal.id === mealId ? { ...meal, amount: parsedAmount } : meal
      )
    );
  }, []);

  // Reset all selections
  const clearSelections = useCallback(() => {
    setSelectedMeals([]);
  }, []);

  // // Calculate total nutritional values with amounts
  // const calculateTotalNutrition = useCallback((meals) => {
  //   return meals.reduce((totals, meal) => {
  //     const amount = meal.amount || 1;
  //     return {
  //       kcal: totals.kcal + (meal.kcal * amount),
  //       protein: totals.protein + (meal.protein * amount),
  //       carbohydrates: totals.carbohydrates + (meal.carbohydrates * amount),
  //       fat: totals.fat + (meal.fat * amount),
  //     };
  //   }, { kcal: 0, protein: 0, carbohydrates: 0, fat: 0 });
  // }, []);

  // Context value
  const value = {
    selectedMeals,
    setSelectedMeals,
    dietSummary,
    isMealSelected,
    toggleMealSelection,
    updateMealAmount,
    clearSelections,
    // calculateTotalNutrition,
    isCalculating: calculateDietMutation.isLoading
  };

  return (
    <MealSelectionContext.Provider value={value}>
      {children}
    </MealSelectionContext.Provider>
  );
}

// Custom hook to use meal selection context
export function useMealSelection() {
  const context = useContext(MealSelectionContext);
  if (!context) {
    throw new Error('useMealSelection must be used within a MealSelectionProvider');
  }
  
  return context;
}