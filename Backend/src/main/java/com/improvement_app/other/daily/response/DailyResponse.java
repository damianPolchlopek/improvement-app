package com.improvement_app.other.daily.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.improvement_app.other.daily.entity.Daily;

import java.time.LocalDate;

public record DailyResponse(
        Long id,
        @JsonFormat(pattern = "dd-MM-yyyy") LocalDate date,
        boolean health,
        boolean exercise,
        boolean book,
        boolean software
) {
    public static DailyResponse from(Daily daily) {
        return new DailyResponse(
                daily.getId(),
                daily.getDate(),
                daily.isHealth(),
                daily.isExercise(),
                daily.isBook(),
                daily.isSoftware()
        );
    }
}
