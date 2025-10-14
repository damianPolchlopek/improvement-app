package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.in.MealManagementUseCase;
import com.improvement_app.food.application.ports.out.MealIngredientPersistencePort;
import com.improvement_app.food.application.ports.out.MealPersistencePort;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.MealSearchCriteria;
import com.improvement_app.food.domain.MealSortCriteria;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import com.improvement_app.food.domain.enums.ProductCategory;
import com.improvement_app.food.ui.response.GetMealIngredientWithProductResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService implements MealManagementUseCase {

    private final MealPersistencePort mealPersistencePort;
    private final MealIngredientPersistencePort mealIngredientPersistencePort;

    @Override
    public List<MealRecipe> searchMeals(MealCategory category,
                                        MealType type,
                                        MealPopularity popularity,
                                        String name,
                                        String sortBy,
                                        boolean adjustToSinglePortion) {

        log.info("Searching meals with criteria: category={}, type={}, popularity={}, name={}",
                category, type, popularity, name);

        MealSearchCriteria searchCriteria = MealSearchCriteria.of(category, type, popularity, name);
        MealSortCriteria sortCriteria = MealSortCriteria.of(sortBy);

        List<MealRecipe> meals = mealPersistencePort.findMeals(searchCriteria, sortCriteria);

        if (adjustToSinglePortion) {
            meals = meals.stream()
                    .map(MealRecipe::adjustToSinglePortion)
                    .toList();
        }

        log.info("Found {} meals matching criteria", meals.size());
        return meals;
    }

    @Override
    public Map<ProductCategory, List<GetMealIngredientWithProductResponse>> getMealIngredients(Long mealId) {
        log.info("Request for meal ingredients for mealId={}", mealId);

        Map<ProductCategory, List<GetMealIngredientWithProductResponse>> mealIngredients =
                mealIngredientPersistencePort.getMealIngredients(mealId)
                        .stream()
                        .map(GetMealIngredientWithProductResponse::from)
                        .collect(Collectors.groupingBy(
                                GetMealIngredientWithProductResponse::productCategory,
                                Collectors.toList()
                        ));

        log.info("Found {} meal ingredients for meal id: {}", mealIngredients, mealId);
        return mealIngredients;
    }

    @Override
    public List<String> getAvailableCategories() {
        return Arrays.stream(MealCategory.values())
                .map(MealCategory::getName)
                .toList();
    }

    @Override
    public List<String> getAvailableTypes() {
        return Arrays.stream(MealType.values())
                .map(MealType::getName)
                .toList();
    }
}
