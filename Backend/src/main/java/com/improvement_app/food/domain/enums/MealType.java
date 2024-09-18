package com.improvement_app.food.domain.enums;

import lombok.Getter;

import java.util.Map;

@Getter
public enum MealType {
    ALL("ALL"),
    CHICKEN("CHICKEN"),
    PORK("PORK"),
    OATMEAL("OATMEAL"),
    EGGS("EGGS"),
    FISH("FISH"),
    COTTAGE_CHEESE("COTTAGE_CHEESE");

    final String name;

    static final Map<String, MealType> TYPE_DEFINITION = Map.of(
            "ALL", MealType.ALL,
            "CHICKEN", MealType.CHICKEN,
            "PORK", MealType.PORK,
            "EGGS", MealType.EGGS,
            "COTTAGE_CHEESE", MealType.COTTAGE_CHEESE,
            "FISH", MealType.FISH,
            "OATMEAL", MealType.OATMEAL
    );

    MealType(String name) {
        this.name = name;
    }

    public static MealType fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealType.ALL);
    }
}
