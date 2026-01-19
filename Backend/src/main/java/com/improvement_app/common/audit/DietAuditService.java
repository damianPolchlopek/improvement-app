package com.improvement_app.common.audit;

import com.improvement_app.food.infrastructure.entity.summary.DietSummaryEntity;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DietAuditService {

    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<Number> getRevisions(Long dietSummaryId) {
        AuditReader reader = AuditReaderFactory.get(entityManager);
        return reader.getRevisions(DietSummaryEntity.class, dietSummaryId);
    }

}
