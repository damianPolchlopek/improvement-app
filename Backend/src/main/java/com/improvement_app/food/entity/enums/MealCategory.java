package com.improvement_app.food.entity.enums;

import java.util.Map;

public enum MealCategory {
    ALL("All"),
    BREAKFAST("Śniadanie"),
    LUNCH("Obiad"),
    HOT_DISH("Ciepły Posiłek"),
    DINNER("Kolacja");

    final String name;

    static final Map<String, MealCategory> TYPE_DEFINITION = Map.of(
            "All", MealCategory.ALL,
            "Obiad", MealCategory.LUNCH,
            "Śniadanie", MealCategory.BREAKFAST,
            "Ciepły Posiłek", MealCategory.HOT_DISH,
            "Kolacja", MealCategory.DINNER
    );

    MealCategory(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static MealCategory fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealCategory.ALL);
    }
}
