package com.improvement_app.workouts.exceptions;

public class ExerciseTypeNotFoundException extends RuntimeException {
    public ExerciseTypeNotFoundException(String message) {
        super("Exercise Type not found for following: " + message);
    }
}
