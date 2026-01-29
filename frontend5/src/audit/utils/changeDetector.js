// features/diet-audit/utils/changeDetector.js

export const detectChanges = (oldRevision, newRevision) => {
  const changes = {
    macroChanges: {
      kcal: newRevision.dietSummary.kcal - oldRevision.dietSummary.kcal,
      protein: newRevision.dietSummary.protein - oldRevision.dietSummary.protein,
      carbohydrates: newRevision.dietSummary.carbohydrates - oldRevision.dietSummary.carbohydrates,
      fat: newRevision.dietSummary.fat - oldRevision.dietSummary.fat,
    },
    mealsAdded: [],
    mealsRemoved: [],
    mealsModified: [],
  };

  const oldMealIds = new Set(oldRevision.dietSummary.meals.map(m => m.id));
  const newMealIds = new Set(newRevision.dietSummary.meals.map(m => m.id));

  // Wykryj dodane posiłki
  newRevision.dietSummary.meals.forEach(meal => {
    if (!oldMealIds.has(meal.id)) {
      changes.mealsAdded.push(meal);
    }
  });

  // Wykryj usunięte posiłki
  oldRevision.dietSummary.meals.forEach(meal => {
    if (!newMealIds.has(meal.id)) {
      changes.mealsRemoved.push(meal);
    }
  });

  // Wykryj zmodyfikowane posiłki
  newRevision.dietSummary.meals.forEach(newMeal => {
    const oldMeal = oldRevision.dietSummary.meals.find(m => m.id === newMeal.id);
    if (oldMeal) {
      const mealChanges = detectMealChanges(oldMeal, newMeal);
      if (mealChanges.hasChanges) {
        changes.mealsModified.push({
          meal: newMeal,
          changes: mealChanges,
        });
      }
    }
  });

  return changes;
};

const detectMealChanges = (oldMeal, newMeal) => {
  const changes = {
    hasChanges: false,
    portionChanged: oldMeal.portionMultiplier !== newMeal.portionMultiplier,
    macrosChanged: {
      kcal: newMeal.cachedKcal !== oldMeal.cachedKcal,
      protein: newMeal.cachedProtein !== oldMeal.cachedProtein,
      carbohydrates: newMeal.cachedCarbohydrates !== oldMeal.cachedCarbohydrates,
      fat: newMeal.cachedFat !== oldMeal.cachedFat,
    },
    ingredientsAdded: [],
    ingredientsRemoved: [],
    ingredientsModified: [],
  };

  const oldIngredients = oldMeal.ingredients || [];
  const newIngredients = newMeal.ingredients || [];

  const oldIngredientIds = new Set(oldIngredients.map(i => i.id));
  const newIngredientIds = new Set(newIngredients.map(i => i.id));

  // Dodane składniki
  newIngredients.forEach(ing => {
    if (!oldIngredientIds.has(ing.id)) {
      changes.ingredientsAdded.push(ing);
      changes.hasChanges = true;
    }
  });

  // Usunięte składniki
  oldIngredients.forEach(ing => {
    if (!newIngredientIds.has(ing.id)) {
      changes.ingredientsRemoved.push(ing);
      changes.hasChanges = true;
    }
  });

  // Zmodyfikowane składniki
  newIngredients.forEach(newIng => {
    const oldIng = oldIngredients.find(i => i.id === newIng.id);
    if (oldIng && oldIng.amount !== newIng.amount) {
      changes.ingredientsModified.push({
        ingredient: newIng,
        oldAmount: oldIng.amount,
        newAmount: newIng.amount,
      });
      changes.hasChanges = true;
    }
  });

  if (changes.portionChanged || Object.values(changes.macrosChanged).some(v => v)) {
    changes.hasChanges = true;
  }

  return changes;
};