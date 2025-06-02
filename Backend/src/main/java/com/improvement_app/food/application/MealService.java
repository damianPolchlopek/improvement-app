package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.application.spec.MealRecipeSpecifications;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {
    private final MealHandler mealHandler;

    public List<MealRecipe> getMeals(MealCategory category,
                                     MealType type,
                                     MealPopularity popularity,
                                     String name,
                                     String sortBy,
                                     boolean onOnePortion) {

        Specification<MealRecipe> spec = Specification
                .where(category != MealCategory.ALL ? MealRecipeSpecifications.hasCategory(category) : null)
                .and(type != MealType.ALL ? MealRecipeSpecifications.hasType(type) : null)
                .and(popularity != MealPopularity.ALL ? MealRecipeSpecifications.hasPopularity(popularity) : null)
                .and(MealRecipeSpecifications.hasNameContaining(name));

        Sort sort = switch (sortBy) {
            case "name" -> Sort.by("name").ascending();
            case "popularity" -> Sort.by("popularity").ascending();
            case "category" -> Sort.by("category").ascending();
            case "type" -> Sort.by("type").ascending();
            default -> Sort.by("name").ascending(); // fallback
        };

        List<MealRecipe> mealRecipes = mealHandler.findAll(spec, sort);

        // Obsługa onOnePortion
        if (onOnePortion) {
            mealRecipes = mealRecipes.stream()
                    .map(meal -> {
                        double portions = meal.getPortionAmount();
                        if (portions > 0) {
                            meal.getIngredients().forEach(ingredient ->
                                    ingredient.setAmount(ingredient.getAmount() / portions));
                        }
                        return meal;
                    })
                    .collect(Collectors.toList());
        }

        return mealRecipes;
    }

    public void deleteAll() {
        mealHandler.deleteAll();
    }

}
