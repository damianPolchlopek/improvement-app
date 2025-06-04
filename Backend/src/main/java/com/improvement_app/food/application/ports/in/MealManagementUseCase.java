package com.improvement_app.food.application.ports.in;

import com.improvement_app.food.domain.Meal;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;

import java.util.List;

/**
 * Port wejściowy (driving port) - definiuje operacje biznesowe dostępne dla klientów aplikacji
 * Implementowany przez serwisy w warstwie aplikacji
 */
public interface MealManagementUseCase {

    List<Meal> searchMeals(MealCategory category,
                           MealType type,
                           MealPopularity popularity,
                           String nameContains,
                           String sortBy,
                           boolean adjustToSinglePortion);

    List<String> getAvailableCategories();

    List<String> getAvailableTypes();
}
