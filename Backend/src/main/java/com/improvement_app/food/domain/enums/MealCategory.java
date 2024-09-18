package com.improvement_app.food.domain.enums;

import lombok.Getter;

import java.util.Map;

@Getter
public enum MealCategory {
    ALL("ALL"),
    BREAKFAST("BREAKFAST"),
    LUNCH("LUNCH"),
    HOT_DISH("HOT_DISH"),
    DINNER("DINNER");

    final String name;

    static final Map<String, MealCategory> TYPE_DEFINITION = Map.of(
            "ALL", MealCategory.ALL,
            "LUNCH", MealCategory.LUNCH,
            "BREAKFAST", MealCategory.BREAKFAST,
            "HOT_DISH", MealCategory.HOT_DISH,
            "DINNER", MealCategory.DINNER
    );

    MealCategory(String name) {
        this.name = name;
    }

    public static MealCategory fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealCategory.ALL);
    }
}
