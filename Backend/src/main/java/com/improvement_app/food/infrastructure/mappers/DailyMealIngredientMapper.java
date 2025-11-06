package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.summary.DailyMealIngredient;
import com.improvement_app.food.infrastructure.entity.meals.ProductEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealIngredientEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DailyMealIngredientMapper {

    private final  EntityManager entityManager;

    public DailyMealIngredient toDomain(DailyMealIngredientEntity entity) {
        if (entity == null) {
            return null;
        }

        return new DailyMealIngredient(
                entity.getId(),
                entity.getProduct().getId(),
                entity.getName(),
                entity.getAmount(),
                entity.getUnit()
        );
    }

    public DailyMealIngredientEntity toEntity(DailyMealIngredient domain) {
        if (domain == null) {
            return null;
        }

        DailyMealIngredientEntity entity = new DailyMealIngredientEntity(
                domain.id(),
                domain.name(),
                domain.amount(),
                domain.unit()
        );

        if (domain.productId() != null) {
            entity.setProduct(
                    entityManager.getReference(ProductEntity.class, domain.productId())
            );
        }

        return entity;
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
