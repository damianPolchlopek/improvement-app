package com.improvement_app.other.daily.request;

public record DailyRequest(
        boolean health,
        boolean exercise,
        boolean book,
        boolean software
) {
}
