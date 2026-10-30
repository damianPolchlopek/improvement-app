package com.improvement_app.other.daily.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.improvement_app.other.daily.entity.DailyRecord;

import java.time.LocalDate;

public record DailyRecordResponse(
        Long id,
        @JsonFormat(pattern = "dd-MM-yyyy") LocalDate date,
        boolean health,
        boolean exercise,
        boolean book,
        boolean software
) {
    public static DailyRecordResponse from(DailyRecord daily) {
        return new DailyRecordResponse(
                daily.getId(),
                daily.getDate(),
                daily.isHealth(),
                daily.isExercise(),
                daily.isBook(),
                daily.isSoftware()
        );
    }
}
