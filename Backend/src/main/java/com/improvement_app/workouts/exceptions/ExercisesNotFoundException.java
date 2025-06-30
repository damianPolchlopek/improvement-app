package com.improvement_app.workouts.exceptions;

public class ExercisesNotFoundException extends RuntimeException {
    public ExercisesNotFoundException(String field, String value, Long userId) {
        super("Exercises following field: %s with value: %s not found for userId: %s".formatted(field, value, userId));
    }
}
