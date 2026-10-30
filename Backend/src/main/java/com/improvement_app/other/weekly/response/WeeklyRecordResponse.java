package com.improvement_app.other.weekly.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.improvement_app.other.weekly.entity.Category;
import com.improvement_app.other.weekly.entity.WeeklyRecord;

import java.time.LocalDate;

public record WeeklyRecordResponse(
        Long id,
        String name,
        Category category,
        @JsonFormat(pattern = "dd-MM-yyyy") LocalDate date
) {
    public static WeeklyRecordResponse from(WeeklyRecord weeklyRecord) {
        return new WeeklyRecordResponse(
                weeklyRecord.getId(),
                weeklyRecord.getName(),
                weeklyRecord.getCategory(),
                weeklyRecord.getDate()
        );
    }
}
