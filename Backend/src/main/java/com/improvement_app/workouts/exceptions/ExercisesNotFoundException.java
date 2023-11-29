package com.improvement_app.workouts.exceptions;

public class ExercisesNotFoundException extends RuntimeException{
    public ExercisesNotFoundException(String field, String value) {
        super("Exercises for following field: %s with value: %s not found".formatted(field, value));
    }
}
