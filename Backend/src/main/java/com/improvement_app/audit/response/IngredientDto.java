package com.improvement_app.audit.response;

public record IngredientDto(
        Long id,
        String name,
        Double amount,
        String unit,
        Double kcal,
        Double protein,
        Double carbohydrates,
        Double fat
) {}
