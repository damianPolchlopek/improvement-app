package com.improvement_app.food.domain.enums;

import lombok.Getter;

import java.util.Map;

@Getter
public enum MealCategory {
    ALL("All"),
    BREAKFAST("Śniadanie"),
    LUNCH("Obiad"),
    HOT_DISH("Ciepły Posiłek"),
    SWEETS("Słodycze"),
    DINNER("Kolacja");

    final String name;

    static final Map<String, MealCategory> TYPE_DEFINITION = Map.of(
            "All", MealCategory.ALL,
            "Obiad", MealCategory.LUNCH,
            "Śniadanie", MealCategory.BREAKFAST,
            "Ciepły Posiłek", MealCategory.HOT_DISH,
            "Słodycze", MealCategory.SWEETS,
            "Kolacja", MealCategory.DINNER
    );

    MealCategory(String name) {
        this.name = name;
    }

    public static MealCategory fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealCategory.ALL);
    }
}
