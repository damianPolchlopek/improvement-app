package com.improvement_app.workouts.dto;

import java.time.LocalDate;

public record ExerciseSearchCriteria(LocalDate date, String name, String trainingName) {
}
