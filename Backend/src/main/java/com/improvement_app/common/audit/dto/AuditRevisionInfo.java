package com.improvement_app.common.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.RevisionType;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditRevisionInfo<T> {
    private T entity;
    private Integer revisionNumber;
    private Instant timestamp;
    private String username;
    private String ipAddress;
    private RevisionType revisionType;

    public String getRevisionTypeDescription() {
        return switch (revisionType) {
            case ADD -> "CREATE";
            case MOD -> "UPDATE";
            case DEL -> "DELETE";
        };
    }

    public LocalDateTime getLocalDateTime() {
        return timestamp.atZone(ZoneId.systemDefault()).toLocalDateTime();
    }
}
