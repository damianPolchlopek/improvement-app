package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.in.CalculationManagementUseCase;
import com.improvement_app.food.application.ports.out.MealIngredientPersistencePort;
import com.improvement_app.food.application.ports.out.ProductPersistencePort;
import com.improvement_app.food.domain.calculate.CalculateResult;
import com.improvement_app.food.domain.recipe.Product;
import com.improvement_app.food.infrastructure.entity.meals.MealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.ui.requests.calculate.CalculateMealIngredientRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateMealRequest;
import com.improvement_app.food.ui.requests.calculate.RecalculateMealMacroRequest;
import com.improvement_app.food.ui.requests.calculate.CalculateDietRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalculationMacroelementsService implements CalculationManagementUseCase {


    private final MealIngredientPersistencePort mealIngredientPersistencePort;
    private final ProductPersistencePort productPersistencePort;


    public CalculateResult calculateDayMacro(CalculateDietRequest calculateDayRequest) {
        return recalculateDayMacro(calculateDayRequest.dailyMeals());
    }

    public CalculateResult recalculateMealMacro(RecalculateMealMacroRequest calculateDietRequest) {
        CalculateMealRequest dailyMeal = calculateDietRequest.dailyMeal();
        return recalculateMealMacro(dailyMeal);
    }







    public CalculateResult recalculateMealMacro(CalculateMealRequest dailyMeal) {
        List<CalculateMealIngredientRequest> mealIngredients = dailyMeal.ingredients();

        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        List<Long> productIds = mealIngredients.stream()
                .map(CalculateMealIngredientRequest::productId)
                .toList();

        Map<Long, Product> products = productPersistencePort.getProducts(productIds)
                .stream()
                .collect(Collectors.toMap(Product::id, Function.identity()));

        for (CalculateMealIngredientRequest eatenMealIngredient : mealIngredients) {
            //TODO: zabezpieczyc przed nullem w mapie

            final Product recipeProductEntity = products.get(eatenMealIngredient.productId());

            totalKcal += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.amount() * recipeProductEntity.kcal();
            totalProtein += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.amount() * recipeProductEntity.protein();
            totalCarbohydrates += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.amount() * recipeProductEntity.carbohydrates();
            totalFat += dailyMeal.portionMultiplier() * eatenMealIngredient.amount() / recipeProductEntity.amount() * recipeProductEntity.fat();
        }

        return new CalculateResult(
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat
        );
    }

    public CalculateResult recalculateDayMacro(List<CalculateMealRequest> dailyMeals) {
        double totalKcal = 0;
        double totalProtein = 0;
        double totalCarbohydrates = 0;
        double totalFat = 0;

        for (CalculateMealRequest dailyMeal : dailyMeals) {
            final CalculateResult recalculatedMeal = recalculateMealMacro(dailyMeal);
            totalKcal += recalculatedMeal.kcal();
            totalProtein += recalculatedMeal.protein();
            totalCarbohydrates += recalculatedMeal.carbohydrates();
            totalFat += recalculatedMeal.fat();
        }

        return new CalculateResult(
                totalKcal,
                totalProtein,
                totalCarbohydrates,
                totalFat);
    }

}
