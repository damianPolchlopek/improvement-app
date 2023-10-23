package com.improvement_app.food.domain.enums;

import lombok.Getter;

import java.util.Map;

@Getter
public enum MealType {
    ALL("All"),
    CHICKEN("Kurczak/Indyk"),
    PORK("Wieprzowina"),
    OATMEAL("Owsianka"),
    EGGS("Jajka"),
    FISH("Ryba"),
    COTTAGE_CHEESE("Twaróg");

    final String name;

    static final Map<String, MealType> TYPE_DEFINITION = Map.of(
            "All", MealType.ALL,
            "Kurczak/Indyk", MealType.CHICKEN,
            "Wieprzowina", MealType.PORK,
            "Jajka", MealType.EGGS,
            "Twaróg", MealType.COTTAGE_CHEESE,
            "Ryba", MealType.FISH,
            "Owsianka", MealType.OATMEAL
    );

    MealType(String name) {
        this.name = name;
    }

    public static MealType fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealType.ALL);
    }
}
