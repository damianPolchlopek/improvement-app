package com.improvement_app.workouts.response;

import lombok.Data;

import java.time.Instant;

@Data
public class ChartPoint {
    Instant localDate;
    Double value;

    public ChartPoint(Instant localDate, Double value) {
        this.localDate = localDate;
        this.value = value;
    }
}
