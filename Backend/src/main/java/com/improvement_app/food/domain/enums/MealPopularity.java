package com.improvement_app.food.domain.enums;

import lombok.Getter;

import java.util.Map;

@Getter
public enum MealPopularity {
    HIGH("HIGH"),
    LOW("LOW"),
    ALL("ALL");

    final String name;

    static final Map<String, MealPopularity> TYPE_DEFINITION = Map.of(
            "HIGH", MealPopularity.HIGH,
            "LOW", MealPopularity.LOW
    );

    MealPopularity(String name) {
        this.name = name;
    }

    public static MealPopularity fromValue(String name){
        return TYPE_DEFINITION.getOrDefault(name, MealPopularity.ALL);
    }
}
