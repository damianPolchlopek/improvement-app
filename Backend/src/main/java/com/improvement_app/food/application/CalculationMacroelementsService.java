package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealIngredientHandler;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.domain.Product;
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

        Map<Long, MealIngredient> recipeMealIngredients = mealIngredientHandler.getMealIngredients(ingredients)
                .stream()
                .collect(Collectors.toMap(MealIngredient::getId, mealIngredient -> mealIngredient));

        for (MealIngredientDTO eatenMealIngredient : mealIngredients) {
            //TODO: zabezpieczyc przed nullem w mapie
            final Product recipeProduct = recipeMealIngredients.get(eatenMealIngredient.id())
                    .getProduct();

            totalKcal += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getKcal();
            totalProtein += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getProtein();
            totalCarbohydrates += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getCarbohydrates();
            totalFat += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getFat();
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
