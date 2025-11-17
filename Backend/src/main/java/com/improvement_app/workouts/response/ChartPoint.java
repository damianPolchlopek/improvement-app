package com.improvement_app.workouts.response;

import com.improvement_app.util.InstantToLocalDateConverter;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
public class ChartPoint {
    LocalDate localDate;
    Double value;

    public ChartPoint(Instant date, Double value) {
        this.localDate = InstantToLocalDateConverter.convert(date);
        this.value = value;
    }
}
