package com.improvement_app.food.domain;

import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;

public record MealSearchCriteria(
        MealCategory category,
        MealType type,
        MealPopularity popularity,
        String nameContains
) {
    public static MealSearchCriteria of(MealCategory category, MealType type,
                                        MealPopularity popularity, String name) {
        return new MealSearchCriteria(category, type, popularity, name);
    }
}
