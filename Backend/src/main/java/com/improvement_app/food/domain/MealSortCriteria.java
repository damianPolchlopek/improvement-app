package com.improvement_app.food.domain;

public record MealSortCriteria(
        String sortBy,
        boolean ascending
) {
    public static MealSortCriteria of(String sortBy) {
        return new MealSortCriteria(sortBy, true);
    }
}
