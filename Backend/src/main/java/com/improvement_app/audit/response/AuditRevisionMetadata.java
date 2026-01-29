package com.improvement_app.audit.response;

import com.improvement_app.audit.envers.CustomRevisionEntity;

import java.time.Instant;

public record AuditRevisionMetadata(
        Integer revisionNumber,
        Instant timestamp,
        String username,
        String ipAddress
) {

    public static AuditRevisionMetadata from(CustomRevisionEntity entity) {
        return new AuditRevisionMetadata(
                entity.getRev(),
                Instant.ofEpochMilli(entity.getRevtstmp()),
                entity.getUsername(),
                entity.getIpAddress()
        );
    }
}
