package com.improvement_app.food.entity.enums;

import java.util.Map;

public enum MealType {
    ALL("All"),
    CHICKEN("Kurczak/Indyk"),
    PORK("Wieprzowina"),
    OATMEAL("Owsianka");

    final String name;

    static final Map<String, MealType> TYPE_DEFINITION = Map.of(
            "All", MealType.ALL,
            "Kurczak/Indyk", MealType.CHICKEN,
            "Wieprzowina", MealType.PORK,
            "Owsianka", MealType.OATMEAL
    );

    MealType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static MealType fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealType.ALL);
    }
}
