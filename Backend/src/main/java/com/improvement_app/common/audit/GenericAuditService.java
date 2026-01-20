package com.improvement_app.common.audit;

import com.improvement_app.common.audit.dto.*;
import com.improvement_app.common.audit.envers.CustomRevisionEntity;
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
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GenericAuditService {

    private final EntityManager entityManager;

    /**
     * Pobiera pełną historię zmian dla dowolnej encji
     */
    @Transactional(readOnly = true)
    public <T> List<AuditRevisionInfo<T>> getEntityHistory(Class<T> entityClass, Object entityId) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Object[]> revisions = reader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true)
                .add(AuditEntity.id().eq(entityId))
                .getResultList();

        return revisions.stream()
                .map(this::<T>mapToAuditRevisionInfo)
                .sorted((a, b) -> b.getRevisionNumber().compareTo(a.getRevisionNumber()))
                .collect(Collectors.toList());
    }

    /**
     * Pobiera różnice między dwiema rewizjami (generic)
     */
    @Transactional(readOnly = true)
    public <T> AuditChanges<T> getChangesBetweenRevisions(
            Class<T> entityClass,
            Object entityId,
            Number oldRevision,
            Number newRevision) {

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

    /**
     * Pobiera wszystkie encje zmienione w danej rewizji
     */
//    @Transactional(readOnly = true)
//    public Map<String, List<Object>> getAllEntitiesInRevision(Number revision) {
//        AuditReader reader = AuditReaderFactory.get(entityManager);
//
//        Set<String> entityNames = reader.getCrossTypeRevisionChangesInTransaction(revision)
//                .stream()
//                .map(Object::getClass)
//                .map(Class::getSimpleName)
//                .collect(Collectors.toSet());
//
//        Map<String, List<Object>> result = new HashMap<>();
//        for (String entityName : entityNames) {
//            result.put(entityName, new ArrayList<>());
//        }
//
//        return result;
//    }

    /**
     * Pobiera zmiany użytkownika w określonym czasie
     */
    @Transactional(readOnly = true)
    public <T> List<AuditRevisionInfo<T>> getUserChanges(
            Class<T> entityClass,
            String username,
            Instant from,
            Instant to) {

        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Object[]> revisions = reader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true)
                .add(AuditEntity.revisionProperty("username").eq(username))
                .add(AuditEntity.revisionProperty("revtstmp").ge(from.toEpochMilli()))
                .add(AuditEntity.revisionProperty("revtstmp").le(to.toEpochMilli()))
                .getResultList();

        return revisions.stream()
                .map(this::<T>mapToAuditRevisionInfo)
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());
    }

    // ========== METODY POMOCNICZE ==========

    private <T> AuditRevisionInfo<T> mapToAuditRevisionInfo(Object[] revisionData) {
        @SuppressWarnings("unchecked")
        T entity = (T) revisionData[0];
        CustomRevisionEntity revEntity = (CustomRevisionEntity) revisionData[1];
        RevisionType revType = (RevisionType) revisionData[2];

        return AuditRevisionInfo.<T>builder()
                .entity(entity)
                .revisionNumber(revEntity.getRev())
                .timestamp(Instant.ofEpochMilli(revEntity.getRevtstmp()))
                .username(revEntity.getUsername())
                .ipAddress(revEntity.getIpAddress())
                .revisionType(revType)
                .build();
    }

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