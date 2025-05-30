package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealIngredientHandler;
import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.domain.Product;
import com.improvement_app.food.domain.dietsummary.EatenMeal;
import com.improvement_app.food.domain.dietsummary.MealIngredientDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

        for (MealIngredientDTO eatenMealIngredient : mealIngredients) {

            MealIngredient recipeMealIngredient = mealIngredientHandler.getMealIngredient(eatenMealIngredient.id())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono składnika o id: " + eatenMealIngredient.id()));
            Product recipeProduct = recipeMealIngredient.getProduct();

            totalKcal += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getKcal();
            totalProtein += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getProtein();
            totalCarbohydrates += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getCarbohydrates();
            totalFat += eatenMeal.amount() * eatenMealIngredient.amount() / recipeProduct.getAmount() * recipeProduct.getFat();

            System.out.println(eatenMeal.amount() + " * " + eatenMealIngredient.amount() + " / " + recipeProduct.getAmount() + " * " + recipeProduct.getKcal() +
                    " = " + totalKcal + " kcal");
        }

        return new EatenMeal(
                eatenMeal.id(),
                eatenMeal.name(),
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat,
                eatenMeal.amount(),
                eatenMeal.url(),
                eatenMeal.category(),
                eatenMeal.type(),
                eatenMeal.popularity(),
                eatenMeal.mealIngredients(),
                eatenMeal.recipe(),
                eatenMeal.amount()
        );
    }


}
