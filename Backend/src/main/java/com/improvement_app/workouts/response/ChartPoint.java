package com.improvement_app.workouts.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ChartPoint {
    LocalDate localDate;
    Double value;

    public ChartPoint(LocalDate date, Double value) {
        this.localDate = date;
        this.value = value;
    }
}
