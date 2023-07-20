package com.improvement_app.food.entity.enums;

import java.util.Map;

public enum MealType {
    ALL("All"),
    CHICKEN("Kurczak/Indyk"),
    PORK("Wieprzowina"),
    OATMEAL("Owsianka"),
    EGGS("Jajka"),
    COTTAGE_CHEESE("Twaróg");

    final String name;

    static final Map<String, MealType> TYPE_DEFINITION = Map.of(
            "All", MealType.ALL,
            "Kurczak/Indyk", MealType.CHICKEN,
            "Wieprzowina", MealType.PORK,
            "Jajka", MealType.EGGS,
            "Twaróg", MealType.COTTAGE_CHEESE,
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
