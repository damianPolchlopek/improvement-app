package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealIngredientEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DailyMealIngredientMapper {
    public DailyMealIngredient toDomain(DailyMealIngredientEntity entity) {
        if (entity == null) {
            return null;
        }

        return new DailyMealIngredient(
                entity.getId(),
                null,
                entity.getName(),
                entity.getAmount(),
                entity.getUnit()
        );
    }

    public DailyMealIngredientEntity toEntity(DailyMealIngredient domain) {
        if (domain == null) {
            return null;
        }

        return new DailyMealIngredientEntity(
                domain.id(),
                domain.name(),
                domain.amount(),
                domain.unit()
                // Uwaga: powiązanie z productEntity celowo pominięte (brak pełnych danych)
        );
    }

    public List<DailyMealIngredient> toDomainList(List<DailyMealIngredientEntity> entities) {
        if (entities == null) return List.of();

        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public List<DailyMealIngredientEntity> toEntityList(List<DailyMealIngredient> ingredients) {
        if (ingredients == null) return List.of();

        return ingredients.stream()
                .map(this::toEntity)
                .toList();
    }
}
