package com.improvement_app.food.infrastructure.mappers;

import com.improvement_app.food.domain.DietSummary;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import com.improvement_app.food.infrastructure.entity.summary.EatenMealEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class DietSummaryMapper {

    private final EatenMealMapper eatenMealMapper;

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
                eatenMealMapper.toDomain(entity.getMeals())
        );
    }

    public DietSummaryEntity toEntity(DietSummary domain) {
        if (domain == null) {
            return null;
        }

        List<EatenMealEntity> mealsEntities = eatenMealMapper.toEntity(domain.meals());

        return new DietSummaryEntity(
                domain.id(),
                domain.kcal(),
                domain.protein(),
                domain.carbohydrates(),
                domain.fat(),
                domain.date(),
                mealsEntities
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
