package com.improvement_app.food.application;

import com.improvement_app.food.application.ports.MealHandler;
import com.improvement_app.food.domain.MealRecipe;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MealService {
    private final MealHandler mealHandler;

    public List<MealRecipe> getMeals(MealCategory mealCategory,
                                     MealType mealType,
                                     MealPopularity mealPopularity,
                                     String mealName,
                                     String sortBy,
                                     boolean onOnePortion) {

        List<MealRecipe> mealRecipes = mealHandler.findAllByName(mealName, sortBy);

        if (mealCategory != MealCategory.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getCategory() == mealCategory)
                    .collect(Collectors.toList());
        }

        if (mealType != MealType.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getType() == mealType)
                    .collect(Collectors.toList());
        }

        if (mealPopularity != MealPopularity.ALL) {
            mealRecipes = mealRecipes
                    .stream()
                    .filter(meal -> meal.getPopularity() == mealPopularity)
                    .collect(Collectors.toList());
        }

        if (onOnePortion) {
            mealRecipes = mealRecipes.stream()
                    .map(meal -> {
                        meal.getIngredients()
                                .forEach(mealIngredient ->
                                        mealIngredient.setAmount(mealIngredient.getAmount() / meal.getPortionAmount()));

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
