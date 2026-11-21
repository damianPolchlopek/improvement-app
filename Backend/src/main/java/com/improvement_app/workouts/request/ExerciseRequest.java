package com.improvement_app.workouts.request;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;

public record ExerciseRequest(
        String id,
        String type,
        String place,
        @NotEmpty String trainingName,
        LocalDate date,
        String name,
        String progress,
        @NotEmpty String reps,
        @NotEmpty String weight,
        int index
) {

    // Wygodny konstruktor bez id (używany m.in. w testach)
    public ExerciseRequest(String type, String place, String name,
                           String progress, LocalDate date, String reps, String weight, String trainingName,
                           int index) {
        this(null, type, place, trainingName, date, name, progress, reps, weight, index);
    }
}
