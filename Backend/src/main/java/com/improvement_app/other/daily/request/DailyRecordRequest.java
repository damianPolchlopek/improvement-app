package com.improvement_app.other.daily.request;

public record DailyRecordRequest(
        boolean health,
        boolean exercise,
        boolean book,
        boolean software
) {
}
