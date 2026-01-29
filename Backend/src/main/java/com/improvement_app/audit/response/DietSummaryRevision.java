package com.improvement_app.audit.response;

import java.util.Date;

public record DietSummaryRevision(
        Number revisionNumber,
        Date revisionTimestamp,
        DietSummaryWithMealsDto dietSummary) {
}
