package com.improvement_app.workouts.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ChartPoint {
    LocalDate localDate;
    Double value;

    public ChartPoint(LocalDate localDate, Double value) {
        this.localDate = localDate;
        this.value = value;
    }
}
