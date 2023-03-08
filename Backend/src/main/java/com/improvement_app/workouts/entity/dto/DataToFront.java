package com.improvement_app.workouts.entity.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DataToFront{
    LocalDate localDate;
    Double value;

    public DataToFront(LocalDate localDate, Double value) {
        this.localDate = localDate;
        this.value = value;
    }
}
