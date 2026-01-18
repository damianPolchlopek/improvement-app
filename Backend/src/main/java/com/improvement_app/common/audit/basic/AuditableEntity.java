package com.improvement_app.common.audit.basic;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class) // Włacza nasłuchiwanie dla JPA Auditing
public class AuditableEntity {

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @CreatedBy
    private String createdBy; // Musi pasować do typu zwracanego przez AuditorAware<T> (String)

    @LastModifiedBy
    private String updatedBy; // Musi pasować do typu zwracanego przez AuditorAware<T> (String)

}
