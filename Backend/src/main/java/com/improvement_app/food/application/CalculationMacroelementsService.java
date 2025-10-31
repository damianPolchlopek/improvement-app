package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.out.MealIngredientPersistencePort;
import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.domain.summary.DietSummary;
import com.improvement_app.food.domain.summary.DailyMeal;
import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CalculationMacroelementsService {

    private final MealIngredientPersistencePort mealIngredientPersistencePort;

    public DailyMeal recalculateMealMacro(DailyMeal dailyMeal) {
        List<DailyMealIngredient> mealIngredients = dailyMeal.ingredients();

        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        List<Long> ingredients = mealIngredients.stream()
                .map(DailyMealIngredient::mealRecipeIngredientId)
                .collect(Collectors.toList());

        Map<Long, ProductEntity> recipeMealIngredients = mealIngredientPersistencePort.getMealIngredients(ingredients)
                .stream()
                .collect(Collectors.toMap(MealIngredientEntity::getId, MealIngredientEntity::getProductEntity));

        for (DailyMealIngredient eatenMealIngredient : mealIngredients) {
            //TODO: zabezpieczyc przed nullem w mapie
            final ProductEntity recipeProductEntity = recipeMealIngredients.get(eatenMealIngredient.mealRecipeIngredientId());

            totalKcal += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getKcal();
            totalProtein += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getProtein();
            totalCarbohydrates += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getCarbohydrates();
            totalFat += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getFat();
        }

        return dailyMeal.updateMacro(
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat
        );
    }

    public DietSummary recalculateDayMacro(List<DailyMeal> dailyMeals) {
        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        for (DailyMeal dailyMeal : dailyMeals) {
            final DailyMeal recalculatedMeal = recalculateMealMacro(dailyMeal);
            totalKcal += recalculatedMeal.kcal();
            totalProtein += recalculatedMeal.protein();
            totalCarbohydrates += recalculatedMeal.carbohydrates();
            totalFat += recalculatedMeal.fat();
        }

        return new DietSummary(
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat,
                dailyMeals);
    }

}
