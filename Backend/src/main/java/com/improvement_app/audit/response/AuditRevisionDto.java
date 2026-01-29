package com.improvement_app.audit.response;

import org.hibernate.envers.RevisionType;

import java.time.Instant;

public record AuditRevisionDto<D>(
        D data,
        Integer revisionNumber,
        Instant timestamp,
        String username,
        String ipAddress,
        RevisionType revisionType
) {

    public static <D> AuditRevisionDto<D> from(
            D data,
            Integer revisionNumber,
            Instant timestamp,
            String username,
            String ipAddress,
            RevisionType revisionType
    ) {
        return new AuditRevisionDto<>(
                data,
                revisionNumber,
                timestamp,
                username,
                ipAddress,
                revisionType
        );
    }
}
