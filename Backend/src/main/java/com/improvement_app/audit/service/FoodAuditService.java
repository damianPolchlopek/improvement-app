package com.improvement_app.audit.service;

import com.improvement_app.audit.response.DailyMealAuditDto;
import com.improvement_app.audit.response.DietSummaryRevision;
import com.improvement_app.audit.response.DietSummaryWithMealsDto;
import com.improvement_app.food.application.exceptions.DietSummaryNotFoundException;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

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
        List<DailyMealAuditDto> meals = getRelatedMealsAtRevision(
                reader,
                summary,
                revision
        );

        // Pobierz informacje o rewizji i timestamp
        Date revisionDate = reader.getRevisionDate(revision);
        DietSummaryWithMealsDto dietSummary = DietSummaryWithMealsDto.from(summary, meals);


        return new DietSummaryRevision(revision, revisionDate, dietSummary);
    }

    private List<DailyMealAuditDto> getRelatedMealsAtRevision(
            AuditReader reader,
            DietSummaryEntity dietSummaryId,
            Number revision) {

        List<DailyMealEntity> mealsQuery = reader.createQuery()
                .forEntitiesAtRevision(DailyMealEntity.class, revision)
                .add(AuditEntity.property("dietSummary").eq(dietSummaryId))
                .getResultList();

        return mealsQuery.stream()
                .map(DailyMealAuditDto::from)
                .toList();
    }


}
