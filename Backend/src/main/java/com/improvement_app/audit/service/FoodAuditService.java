package com.improvement_app.audit.service;

import com.improvement_app.audit.envers.CustomRevisionEntity;
import com.improvement_app.audit.response.AuditRevisionDto;
import com.improvement_app.audit.response.DailyMealAuditDto;
import com.improvement_app.audit.response.DietSummaryWithMealsDto;
import com.improvement_app.food.application.exceptions.DietSummaryNotFoundException;
import com.improvement_app.food.infrastructure.entity.summary.DailyMealEntity;
import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodAuditService {

    private final EntityManager entityManager;


    /**
     * Pobiera pełny snapshot diet_summary wraz z meals i ingredients
     */
    @Transactional(readOnly = true)
    public DietSummaryWithMealsDto getFullSnapshotAtRevision(Long dietSummaryId, Number revision) {
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

        return DietSummaryWithMealsDto.from(summary, meals);
    }

    /**
     * Pobiera DailyMeals powiązane z DietSummary w konkretnej rewizji
     */
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







    /**
     * Pobiera pełną historię zmian dla dowolnej encji
     */
    public <E, D> List<AuditRevisionDto<D>> getEntityHistoryAsDto(
            Class<E> entityClass,
            Object entityId,
            Function<E, D> mapper) {

        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Object[]> revisions = reader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true)
                .add(AuditEntity.id().eq(entityId))
                .getResultList();

        return revisions.stream()
                .map(revData -> {
                    @SuppressWarnings("unchecked")
                    E entity = (E) revData[0];
                    CustomRevisionEntity rev = (CustomRevisionEntity) revData[1];
                    RevisionType revType = (RevisionType) revData[2];

                    D dto = mapper.apply(entity);

                    return AuditRevisionDto.from(
                            dto,
                            rev.getRev(),
                            Instant.ofEpochMilli(rev.getRevtstmp()),
                            rev.getUsername(),
                            rev.getIpAddress(),
                            revType
                    );
                })
                .sorted((a, b) -> b.getRevisionNumber().compareTo(a.getRevisionNumber()))
                .collect(Collectors.toList());
    }

}
