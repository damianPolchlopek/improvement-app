package com.improvement_app.workouts.response;

import java.time.LocalDate;
import java.util.Map;

public record TrainingDayResponse(
        LocalDate date,
        Map<String, ExerciseResponse> exercises
) {
}
