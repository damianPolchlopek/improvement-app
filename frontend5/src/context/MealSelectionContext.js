import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useDietCalculation } from './useDietCalculation';

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
  

  const { calculateDiet } = useDietCalculation();

  // Recalculate diet when selected meals change
  useEffect(() => {
    if (selectedMeals.length > 0) {

      calculateDiet.mutate(selectedMeals, {
        onSuccess: (response) => setDietSummary(response)
      });

      // calculateMacro.mutate(selectedMeals);

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
    const parsedAmount = parseFloat(newAmount) || 1;
    
    setSelectedMeals(prev => 
      prev.map(meal => 
        meal.id === mealId ? { ...meal, amount: parsedAmount } : meal
      )
    );
  }, []);

  const updateMealIngredient = useCallback((mealId, productId, newMealIngredientAmount) => {
    setSelectedMeals(prev => 
      prev.map(meal => 
        meal.id === mealId ? { 
          ...meal, 
          mealIngredients: meal.mealIngredients.map(ingredient => 
            ingredient.productId === productId ? 
              {...ingredient, amount: newMealIngredientAmount } : 
              ingredient
          ) 
        } : meal
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
    dietSummary,
    isMealSelected,
    toggleMealSelection,
    updateMealAmount,
    updateMealIngredient,
    clearSelections
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