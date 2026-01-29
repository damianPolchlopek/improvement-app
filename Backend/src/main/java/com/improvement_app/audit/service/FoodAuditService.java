package com.improvement_app.audit.service;

import com.improvement_app.audit.response.*;
import com.improvement_app.food.application.exceptions.DietSummaryNotFoundException;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealIngredientEntity;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodAuditService {

    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public DietSummaryRevision getFullSnapshotAtRevision(Long dietSummaryId, Number revision) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        // 1. Pobierz główną encję
        DietSummaryEntity summary = reader.find(
                DietSummaryEntity.class,
                dietSummaryId,
                revision
        );

        if (summary == null) {
            throw new DietSummaryNotFoundException(dietSummaryId);
        }

        // 2. Pobierz meals z tej samej rewizji
        List<DailyMealDto> meals = getRelatedMealsAtRevision(
                reader,
                summary,
                revision
        );

        // Pobierz informacje o rewizji i timestamp
        Date revisionDate = reader.getRevisionDate(revision);
        DietSummaryWithMealsDto dietSummary = DietSummaryWithMealsDto.from(summary, meals);


        return new DietSummaryRevision(revision, revisionDate, dietSummary);
    }

    private List<DailyMealDto> getRelatedMealsAtRevision(
            AuditReader reader,
            DietSummaryEntity dietSummaryId,
            Number revision) {

        List<DailyMealEntity> mealsQuery = reader.createQuery()
                .forEntitiesAtRevision(DailyMealEntity.class, revision)
                .add(AuditEntity.property("dietSummary").eq(dietSummaryId))
                .getResultList();

        return mealsQuery.stream()
                .map(DailyMealDto::from)
                .toList();
    }


    @Transactional(readOnly = true)
    public RevisionComparisonDTO compareRevisions(
            Long dietSummaryId,
            Integer olderRevisionNumber,
            Integer newerRevisionNumber
    ) {
        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        DietSummaryEntity olderRevision = auditReader.find(
                DietSummaryEntity.class,
                dietSummaryId,
                olderRevisionNumber
        );

        DietSummaryEntity newerRevision = auditReader.find(
                DietSummaryEntity.class,
                dietSummaryId,
                newerRevisionNumber
        );

        if (olderRevision == null || newerRevision == null) {
            throw new IllegalArgumentException("Nie znaleziono rewizji");
        }

        RevisionComparisonDTO.MacroChangesDTO macroChanges = calculateMacroChanges(olderRevision, newerRevision);

        List<DailyMealDto> mealsAdded = new ArrayList<>();
        List<DailyMealDto> mealsRemoved = new ArrayList<>();
        List<RevisionComparisonDTO.ModifiedMealDTO> mealsModified = new ArrayList<>();

        detectMealChanges(
                olderRevision,
                newerRevision,
                mealsAdded,
                mealsRemoved,
                mealsModified
        );

        return new RevisionComparisonDTO(
                mapToRevisionData(olderRevision, olderRevisionNumber),
                mapToRevisionData(newerRevision, newerRevisionNumber),
                macroChanges,
                mealsAdded,
                mealsRemoved,
                mealsModified
        );
    }

    private RevisionComparisonDTO.MacroChangesDTO calculateMacroChanges(DietSummaryEntity older, DietSummaryEntity newer) {
        return new RevisionComparisonDTO.MacroChangesDTO(
                createMacroDetail(older.getKcal(), newer.getKcal()),
                createMacroDetail(older.getProtein(), newer.getProtein()),
                createMacroDetail(older.getCarbohydrates(), newer.getCarbohydrates()),
                createMacroDetail(older.getFat(), newer.getFat())
        );
    }

    private RevisionComparisonDTO.MacroChangeDetailDTO createMacroDetail(Double oldValue, Double newValue) {
        double diff = newValue - oldValue;
        double percentChange = oldValue != 0 ? (diff / oldValue) * 100 : 0;

        return new RevisionComparisonDTO.MacroChangeDetailDTO(
                oldValue,
                newValue,
                diff,
                percentChange
        );
    }

    private void detectMealChanges(
            DietSummaryEntity older,
            DietSummaryEntity newer,
            List<DailyMealDto> mealsAdded,
            List<DailyMealDto> mealsRemoved,
            List<RevisionComparisonDTO.ModifiedMealDTO> mealsModified
    ) {
        Set<Long> oldMealIds = older.getMeals().stream()
                .map(DailyMealEntity::getId)
                .collect(Collectors.toSet());

        Set<Long> newMealIds = newer.getMeals().stream()
                .map(DailyMealEntity::getId)
                .collect(Collectors.toSet());

        // Dodane posiłki
        newer.getMeals().stream()
                .filter(meal -> !oldMealIds.contains(meal.getId()))
                .map(DailyMealDto::from)
                .forEach(mealsAdded::add);

        // Usunięte posiłki
        older.getMeals().stream()
                .filter(meal -> !newMealIds.contains(meal.getId()))
                .map(DailyMealDto::from)
                .forEach(mealsRemoved::add);

        // Zmodyfikowane posiłki
        newer.getMeals().stream()
                .filter(newMeal -> oldMealIds.contains(newMeal.getId()))
                .forEach(newMeal -> {
                    DailyMealEntity oldMeal = older.getMeals().stream()
                            .filter(m -> m.getId().equals(newMeal.getId()))
                            .findFirst()
                            .orElse(null);

                    if (oldMeal != null) {
                        RevisionComparisonDTO.MealChangesDTO changes = detectMealChanges(oldMeal, newMeal);
                        if (changes.hasChanges()) {
                            mealsModified.add(new RevisionComparisonDTO.ModifiedMealDTO(
                                    DailyMealDto.from(newMeal),
                                    changes
                            ));
                        }
                    }
                });
    }

    private RevisionComparisonDTO.MealChangesDTO detectMealChanges(DailyMealEntity oldMeal, DailyMealEntity newMeal) {
        boolean portionChanged = oldMeal.getPortionMultiplier() != newMeal.getPortionMultiplier();

        RevisionComparisonDTO.MacrosChangedDTO macrosChanged = new RevisionComparisonDTO.MacrosChangedDTO(
                oldMeal.getCachedKcal() != newMeal.getCachedKcal(),
                oldMeal.getCachedProtein() != newMeal.getCachedProtein(),
                oldMeal.getCachedCarbohydrates() != newMeal.getCachedCarbohydrates(),
                oldMeal.getCachedFat() != newMeal.getCachedFat()
        );

        List<IngredientDto> ingredientsAdded = new ArrayList<>();
        List<IngredientDto> ingredientsRemoved = new ArrayList<>();
        List<RevisionComparisonDTO.ModifiedIngredientDTO> ingredientsModified = new ArrayList<>();

        detectIngredientChanges(
                oldMeal,
                newMeal,
                ingredientsAdded,
                ingredientsRemoved,
                ingredientsModified
        );

        boolean hasChanges = portionChanged
                || macrosChanged.kcal()
                || macrosChanged.protein()
                || macrosChanged.carbohydrates()
                || macrosChanged.fat()
                || !ingredientsAdded.isEmpty()
                || !ingredientsRemoved.isEmpty()
                || !ingredientsModified.isEmpty();

        return new RevisionComparisonDTO.MealChangesDTO(
                hasChanges,
                portionChanged,
                macrosChanged,
                ingredientsAdded,
                ingredientsRemoved,
                ingredientsModified
        );
    }

    private void detectIngredientChanges(
            DailyMealEntity oldMeal,
            DailyMealEntity newMeal,
            List<IngredientDto> ingredientsAdded,
            List<IngredientDto> ingredientsRemoved,
            List<RevisionComparisonDTO.ModifiedIngredientDTO> ingredientsModified
    ) {
        Set<Long> oldIngredientIds = oldMeal.getMealIngredients().stream()
                .map(DailyMealIngredientEntity::getId)
                .collect(Collectors.toSet());

        Set<Long> newIngredientIds = newMeal.getMealIngredients().stream()
                .map(DailyMealIngredientEntity::getId)
                .collect(Collectors.toSet());

        // Dodane składniki
        newMeal.getMealIngredients().stream()
                .filter(ing -> !oldIngredientIds.contains(ing.getId()))
                .map(this::mapToIngredientDTO)
                .forEach(ingredientsAdded::add);

        // Usunięte składniki
        oldMeal.getMealIngredients().stream()
                .filter(ing -> !newIngredientIds.contains(ing.getId()))
                .map(this::mapToIngredientDTO)
                .forEach(ingredientsRemoved::add);

        // Zmodyfikowane składniki
        newMeal.getMealIngredients().stream()
                .filter(newIng -> oldIngredientIds.contains(newIng.getId()))
                .forEach(newIng -> {
                    DailyMealIngredientEntity oldIng = oldMeal.getMealIngredients().stream()
                            .filter(i -> i.getId().equals(newIng.getId()))
                            .findFirst()
                            .orElse(null);

                    if (oldIng != null && ( oldIng.getAmount() != newIng.getAmount()) ) {
                        ingredientsModified.add(new RevisionComparisonDTO.ModifiedIngredientDTO(
                                mapToIngredientDTO(newIng),
                                oldIng.getAmount(),
                                newIng.getAmount()
                        ));
                    }
                });
    }

    private RevisionComparisonDTO.RevisionDataDTO mapToRevisionData(DietSummaryEntity entity, Integer revisionNumber) {
        // Pobierz timestamp rewizji
        AuditReader auditReader = AuditReaderFactory.get(entityManager);
        java.util.Date revisionDate = auditReader.getRevisionDate(revisionNumber);

        String revisionTimestamp = revisionDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()
                .toString();

        DietSummaryDto dietSummaryDto = DietSummaryDto.from(entity);

        return new RevisionComparisonDTO.RevisionDataDTO(
                revisionNumber,
                revisionTimestamp,
                dietSummaryDto
        );
    }

    private IngredientDto mapToIngredientDTO(DailyMealIngredientEntity ingredient) {
        return new IngredientDto(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getAmount(),
                ingredient.getUnit().toString(),
                ingredient.getProduct().getKcal(),
                ingredient.getProduct().getProtein(),
                ingredient.getProduct().getCarbohydrates(),
                ingredient.getProduct().getFat()

//                ingredient.getKcal(),
//                ingredient.getProtein(),
//                ingredient.getCarbohydrates(),
//                ingredient.getFat()
        );
    }
}
