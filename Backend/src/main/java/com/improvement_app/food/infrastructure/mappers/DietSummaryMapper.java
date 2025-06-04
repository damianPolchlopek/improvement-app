package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.infrastructure.entity.DietSummaryEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DietSummaryMapper {

    public DietSummary toDomain(DietSummaryEntity entity) {
        if (entity == null) {
            return null;
        }

        return new DietSummary(
                entity.getId(),
                entity.getKcal(),
                entity.getProtein(),
                entity.getCarbohydrates(),
                entity.getFat(),
                entity.getDate(),
                entity.getMeals()
        );
    }

    public DietSummaryEntity toEntity(DietSummary domain) {
        if (domain == null) {
            return null;
        }

        return new DietSummaryEntity(
                domain.id(),
                domain.kcal(),
                domain.protein(),
                domain.carbohydrates(),
                domain.fat(),
                domain.date(),
                domain.meals()
        );
    }

    public List<DietSummary> toDomain(List<DietSummaryEntity> entities) {
        return entities.stream()
                .map(this::toDomain)
                .toList();
    }

    public List<DietSummaryEntity> toEntity(List<DietSummary> domains) {
        return domains.stream()
                .map(this::toEntity)
                .toList();
    }
}
