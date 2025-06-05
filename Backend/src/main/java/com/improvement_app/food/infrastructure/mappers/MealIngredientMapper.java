package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.MealIngredient;
import com.improvement_app.food.infrastructure.entity.MealIngredientEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MealIngredientMapper {

    public MealIngredient toDomain(MealIngredientEntity entity) {
        if (entity == null) {
            return null;
        }

        return new MealIngredient(
                entity.getId(),
                entity.getName(),
                entity.getAmount(),
                entity.getUnit(),
                entity.getProductEntity() != null ? entity.getProductEntity().getId() : null
        );
    }

    public MealIngredientEntity toEntity(MealIngredient domain) {
        if (domain == null) {
            return null;
        }

        return new MealIngredientEntity(
                domain.id(),
                domain.name(),
                domain.amount(),
                domain.unit()
                // Uwaga: powiązanie z productEntity celowo pominięte (brak pełnych danych)
        );
    }

    public List<MealIngredient> toDomainList(List<MealIngredientEntity> entities) {
        if (entities == null) return List.of();

        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public List<MealIngredientEntity> toEntityList(List<MealIngredient> ingredients) {
        if (ingredients == null) return List.of();

        return ingredients.stream()
                .map(this::toEntity)
                .toList();
    }
}
