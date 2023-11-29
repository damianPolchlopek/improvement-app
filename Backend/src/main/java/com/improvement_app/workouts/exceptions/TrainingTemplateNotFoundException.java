package com.improvement_app.workouts.exceptions;

public class TrainingTemplateNotFoundException extends RuntimeException {
    public TrainingTemplateNotFoundException(String convertedTrainingType) {
        super("Training template not found for following type: " + convertedTrainingType);
    }
}
