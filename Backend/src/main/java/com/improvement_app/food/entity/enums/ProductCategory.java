package com.improvement_app.food.entity.enums;

import java.util.Map;

public enum ProductCategory {
    ALL("ALL"),
    MEAT("Mięso"),
    DAIRY("Nabiał"),
    CARBS("Węgle"),
    FAT("Tłuszcze"),
    FRUIT_VEGETABLES("OwoceWarzywa"),
    SPICES("Przyprawy"),
    SWEETS("Słodycze"),
    OTHER("Inne");

    final String name;

    static final Map<String, ProductCategory> TYPE_DEFINITION = Map.of(
            "ALL", ProductCategory.ALL,
            "Mięso", ProductCategory.MEAT,
            "Nabiał", ProductCategory.DAIRY,
            "Węgle", ProductCategory.CARBS,
            "Tłuszcze", ProductCategory.FAT,
            "OwoceWarzywa", ProductCategory.FRUIT_VEGETABLES,
            "Przyprawy", ProductCategory.SPICES,
            "Słodycze", ProductCategory.SWEETS,
            "Inne", ProductCategory.OTHER
    );

    ProductCategory(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static ProductCategory fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, ProductCategory.OTHER);
    }

}
