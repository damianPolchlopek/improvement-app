package com.improvement_app.audit.dto;

import java.time.LocalDateTime;

public record RevisionInfo(
        Long revisionNumber,
        LocalDateTime timestamp
) {}