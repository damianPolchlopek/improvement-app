package com.improvement_app.workouts.response;

import com.improvement_app.workouts.entity.ExerciseNameEntity;
import com.improvement_app.workouts.entity.TrainingTemplateEntity;

import java.util.List;

public record TrainingTemplateResponse(
        Long id,
        String name,
        List<String> exercises
) {

    public static TrainingTemplateResponse of(TrainingTemplateEntity trainingTemplateEntity) {
        List<String> metadataResponses = trainingTemplateEntity.getExercises().stream()
                .map(ExerciseNameEntity::getName)
                .toList();

        return new TrainingTemplateResponse(trainingTemplateEntity.getId(),
                trainingTemplateEntity.getName(),
                metadataResponses);
    }

}
