package com.improvement_app.common.audit.dto;

import com.improvement_app.common.audit.envers.CustomRevisionEntity;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
public class AuditRevisionMetadata {
    private Integer revisionNumber;
    private Instant timestamp;
    private String username;
    private String ipAddress;

    public static AuditRevisionMetadata from(CustomRevisionEntity entity) {
        return AuditRevisionMetadata.builder()
                .revisionNumber(entity.getRev())
                .timestamp(Instant.ofEpochMilli(entity.getRevtstmp()))
                .username(entity.getUsername())
                .ipAddress(entity.getIpAddress())
                .build();
    }

    public LocalDateTime getLocalDateTime() {
        return timestamp.atZone(ZoneId.systemDefault()).toLocalDateTime();
    }
}