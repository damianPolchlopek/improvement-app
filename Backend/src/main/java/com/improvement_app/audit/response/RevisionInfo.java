package com.improvement_app.audit.response;

import org.hibernate.envers.RevisionType;

import java.time.LocalDateTime;

public record RevisionInfo(
        int revisionNumber,
        LocalDateTime revisionTimestamp,
        RevisionType revisionType
) {}