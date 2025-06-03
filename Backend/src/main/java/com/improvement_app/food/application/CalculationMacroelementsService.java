package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealIngredientHandler;
import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.ProductEntity;
import com.improvement_app.food.domain.dietsummary.DietSummary;
import com.improvement_app.food.domain.dietsummary.EatenMeal;
import com.improvement_app.food.domain.dietsummary.MealIngredientDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CalculationMacroelementsService {

    private final MealIngredientHandler mealIngredientHandler;

    public EatenMeal recalculateMealMacro(EatenMeal eatenMeal) {
        List<MealIngredientDTO> mealIngredients = eatenMeal.mealIngredients();

        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        List<Long> ingredients = mealIngredients.stream()
                .map(MealIngredientDTO::id)
                .collect(Collectors.toList());

        Map<Long, MealIngredientEntity> recipeMealIngredients = mealIngredientHandler.getMealIngredients(ingredients)
                .stream()
                .collect(Collectors.toMap(MealIngredientEntity::getId, mealIngredient -> mealIngredient));

        for (MealIngredientDTO eatenMealIngredient : mealIngredients) {
            //TODO: zabezpieczyc przed nullem w mapie
            final ProductEntity recipeProductEntity = recipeMealIngredients.get(eatenMealIngredient.id())
                    .getProductEntity();

            totalKcal += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getKcal();
            totalProtein += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getProtein();
            totalCarbohydrates += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getCarbohydrates();
            totalFat += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProductEntity.getAmount() * recipeProductEntity.getFat();
        }

        return eatenMeal.updateMacro(
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat
        );
    }

    public DietSummary recalculateDayMacro(List<EatenMeal> eatenMeals) {
        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        for (EatenMeal eatenMeal : eatenMeals) {
            final EatenMeal recalculatedMeal = recalculateMealMacro(eatenMeal);
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
                eatenMeals);
    }

}
