package com.improvement_app.food.application.spec;

import com.improvement_app.food.infrastructure.entity.meals.MealRecipeEntity;
import com.improvement_app.food.domain.enums.MealCategory;
import com.improvement_app.food.domain.enums.MealPopularity;
import com.improvement_app.food.domain.enums.MealType;
import org.springframework.data.jpa.domain.Specification;

public class MealRecipeSpecifications {

    private MealRecipeSpecifications() {
        // Private constructor to prevent instantiation
    }

    public static Specification<MealRecipeEntity> hasNameContaining(String name) {
        return (root, query, cb) -> name != null && !name.isBlank()
                ? cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%")
                : null;
    }

    public static Specification<MealRecipeEntity> hasCategory(MealCategory category) {
        return (root, query, cb) -> category != null
                ? cb.equal(root.get("category"), category)
                : null;
    }

    public static Specification<MealRecipeEntity> hasType(MealType type) {
        return (root, query, cb) -> type != null
                ? cb.equal(root.get("type"), type)
                : null;
    }

    public static Specification<MealRecipeEntity> hasPopularity(MealPopularity popularity) {
        return (root, query, cb) -> popularity != null
                ? cb.equal(root.get("popularity"), popularity)
                : null;
    }

    public static Specification<MealRecipeEntity> isOnOnePortion(Boolean onOnePortion) {
        return (root, query, cb) -> onOnePortion != null && onOnePortion
                ? cb.isTrue(root.get("onOnePortion"))
                : null;
    }

}
