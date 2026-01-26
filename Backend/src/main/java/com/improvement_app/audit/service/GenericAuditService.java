package com.improvement_app.audit.service;

import com.improvement_app.audit.dto.AuditChanges;
import com.improvement_app.audit.dto.AuditFieldChange;
import com.improvement_app.audit.dto.AuditRevisionMetadata;
import com.improvement_app.audit.dto.RevisionInfo;
import com.improvement_app.audit.envers.CustomRevisionEntity;
import com.improvement_app.audit.response.AuditRevisionDto;
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

import java.lang.reflect.Field;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GenericAuditService {

    private final EntityManager entityManager;


    @Transactional(readOnly = true)
    public List<RevisionInfo> getRevisionHistory(Class<?> entityClass, Long entityId) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Number> revisions = reader.getRevisions(entityClass, entityId);

        return revisions.stream()
                .map(rev -> {
                    Date revDate = reader.getRevisionDate(rev);
                    return new RevisionInfo(
                            rev.longValue(),
                            LocalDateTime.ofInstant(revDate.toInstant(), ZoneId.systemDefault())
                    );
                })
                .sorted(Comparator.comparing(RevisionInfo::timestamp).reversed())
                .toList();
    }

    /**
     * Pobiera różnice między dwiema rewizjami (generic)
     */
    @Transactional(readOnly = true)
    public <T> AuditChanges<T> getChangesBetweenRevisions(
            Class<T> entityClass,
            Object entityId,
            Number oldRevision,
            Number newRevision
    ) {

        AuditReader reader = AuditReaderFactory.get(entityManager);

        T oldVersion = reader.find(entityClass, entityId, oldRevision);
        T newVersion = reader.find(entityClass, entityId, newRevision);

        if (oldVersion == null || newVersion == null) {
            throw new IllegalArgumentException("One or both revisions not found");
        }

        return compareEntitiesGeneric(oldVersion, newVersion, oldRevision, newRevision);
    }

    /**
     * Pobiera zmiany w konkretnej rewizji (porównuje z poprzednią)
     */
    @Transactional(readOnly = true)
    public <T> AuditChanges<T> getRevisionChanges(Class<T> entityClass, Object entityId, Number revision) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Number> allRevisions = reader.getRevisions(entityClass, entityId);

        if (allRevisions.isEmpty()) {
            throw new IllegalArgumentException("No revisions found for entity");
        }

        // Znajdź poprzednią rewizję
        Number previousRevision = null;
        for (int i = 0; i < allRevisions.size(); i++) {
            if (allRevisions.get(i).equals(revision)) {
                if (i > 0) {
                    previousRevision = allRevisions.get(i - 1);
                }
                break;
            }
        }

        if (previousRevision == null) {
            // Pierwsza rewizja - CREATE
            T entity = reader.find(entityClass, entityId, revision);
            return AuditChanges.createOperation(entity, revision);
        }

        return getChangesBetweenRevisions(entityClass, entityId, previousRevision, revision);
    }

    /**
     * Pobiera metadane rewizji
     */
    @Transactional(readOnly = true)
    public AuditRevisionMetadata getRevisionMetadata(Number revision) {
        AuditReader reader = AuditReaderFactory.get(entityManager);
        CustomRevisionEntity revEntity = reader.findRevision(CustomRevisionEntity.class, revision);

        if (revEntity == null) {
            throw new IllegalArgumentException("Revision not found: " + revision);
        }

        return AuditRevisionMetadata.from(revEntity);
    }

    // ========== METODY POMOCNICZE ==========


    private <T> AuditChanges<T> compareEntitiesGeneric(
            T oldVersion,
            T newVersion,
            Number oldRevision,
            Number newRevision) {

        Map<String, AuditFieldChange> changes = new HashMap<>();

        // Użyj refleksji do porównania wszystkich pól
        Field[] fields = oldVersion.getClass().getDeclaredFields();

        for (Field field : fields) {
            // Pomiń pola Hibernate (proxies, collections itp.)
            if (shouldSkipField(field)) {
                continue;
            }

            try {
                field.setAccessible(true);
                Object oldValue = field.get(oldVersion);
                Object newValue = field.get(newVersion);

                if (!Objects.equals(oldValue, newValue)) {
                    changes.put(field.getName(), new AuditFieldChange(
                            field.getName(),
                            oldValue,
                            newValue,
                            field.getType().getSimpleName()
                    ));
                }
            } catch (IllegalAccessException e) {
                log.warn("Cannot access field: {}", field.getName(), e);
            }
        }

        return AuditChanges.<T>builder()
                .oldVersion(oldVersion)
                .newVersion(newVersion)
                .oldRevision(oldRevision.intValue())
                .newRevision(newRevision.intValue())
                .changes(changes)
                .hasChanges(!changes.isEmpty())
                .build();
    }

    private boolean shouldSkipField(Field field) {
        String fieldName = field.getName();
        String fieldType = field.getType().getName();

        // Pomiń kolekcje Hibernate, lazy proxies itp.
        return fieldName.startsWith("$")
                || fieldName.equals("serialVersionUID")
                || fieldType.contains("HibernateProxy")
                || fieldType.contains("PersistentBag")
                || fieldType.contains("PersistentSet")
                || fieldType.contains("PersistentList")
                || java.util.Collection.class.isAssignableFrom(field.getType());
    }
}