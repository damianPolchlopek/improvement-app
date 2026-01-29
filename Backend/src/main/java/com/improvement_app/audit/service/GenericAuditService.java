package com.improvement_app.audit.service;

import com.improvement_app.audit.envers.CustomRevisionEntity;
import com.improvement_app.audit.response.AuditRevisionDto;
import com.improvement_app.audit.response.AuditRevisionMetadata;
import com.improvement_app.audit.response.RevisionInfo;
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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
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

        @SuppressWarnings("unchecked")
        List<Object[]> results = reader.createQuery()
                .forRevisionsOfEntity(entityClass, false, true)
                .add(AuditEntity.id().eq(entityId))
                .getResultList();

        return results.stream()
                .map(row -> {
                    CustomRevisionEntity revisionEntity = (CustomRevisionEntity) row[1];
                    RevisionType revisionType = (RevisionType) row[2];

                    return new RevisionInfo(
                            revisionEntity.getRev(),
                            LocalDateTime.ofInstant(
                                    Instant.ofEpochMilli(revisionEntity.getRevtstmp()),
                                    ZoneId.systemDefault()
                            ),
                            revisionType
                    );
                })
                .sorted(Comparator.comparing(RevisionInfo::revisionTimestamp).reversed())
                .toList();
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

    @Transactional(readOnly = true)
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
                .sorted((a, b) -> b.revisionNumber().compareTo(a.revisionNumber()))
                .collect(Collectors.toList());
    }

}