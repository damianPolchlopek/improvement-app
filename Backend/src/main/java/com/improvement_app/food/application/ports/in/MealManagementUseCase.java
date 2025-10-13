package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.ui.response.GetMealIngredientWithProductResponse;

import java.util.List;
import java.util.Map;

/**
 * Port wejściowy (driving port) - definiuje operacje biznesowe dostępne dla klientów aplikacji
 * Implementowany przez serwisy w warstwie aplikacji
 */
public interface MealManagementUseCase {

    List<MealRecipe> searchMeals(MealCategory category,
                                 MealType type,
                                 MealPopularity popularity,
                                 String nameContains,
                                 String sortBy,
                                 boolean adjustToSinglePortion);

    List<String> getAvailableCategories();

    List<String> getAvailableTypes();

    Map<ProductCategory, List<GetMealIngredientWithProductResponse>> getMealIngredients(Long id);

}
