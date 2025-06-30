package com.improvement_app.workouts.response;

import com.improvement_app.workouts.entity.ExerciseNameEntity;

public record ExerciseMetadataResponse(String name) {
    public static ExerciseMetadataResponse of(ExerciseNameEntity exerciseMetadataResponse) {
        return new ExerciseMetadataResponse(exerciseMetadataResponse.getName());
    }
}
