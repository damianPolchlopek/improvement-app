package com.improvement_app.workouts.response;

import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.enums.ExerciseType;

import java.time.Instant;
import java.util.stream.Collectors;

public record ExerciseResponse(
        Long id,
        String name,
        String type,
        String progress,
        String place,
        String trainingName,
        Instant date,
        String weight,
        String reps
) {
    public ExerciseResponse(ExerciseEntity entity) {
        this(
                entity.getId(),
                entity.getName().getValue(),
                entity.getType() != null ? entity.getType().getValue() : null,
                entity.getProgress() != null ? entity.getProgress().getValue() : null,
                entity.getTraining() != null ? entity.getTraining().getPlace().getValue() : null,
                entity.getTraining() != null ? entity.getTraining().getName() : null,
                entity.getTraining() != null ? entity.getTraining().getDate() : null,
                formatWeightsToString(entity),
                formatRepsToString(entity)
        );
    }

    private static String formatRepsToString(ExerciseEntity exerciseEntity) {
        String result = exerciseEntity.getExerciseSets().stream()
                .map(set -> formatDouble(set.getRep()))
                .collect(Collectors.joining("/"));

        if (exerciseEntity.getType() == ExerciseType.KARDIO ||
                exerciseEntity.getType() == ExerciseType.ROWER) {
            result += " km";
        }

        return result;
    }

    private static String formatDouble(Double value) {
        return value % 1 == 0 ? String.valueOf(value.intValue()) : String.valueOf(value);
    }

    private static String formatWeightsToString(ExerciseEntity exerciseEntity) {
        String result = exerciseEntity.getExerciseSets().stream()
                .map(set -> formatDouble(set.getWeight()))
                .collect(Collectors.joining("/"));

        if (exerciseEntity.getType() == ExerciseType.KARDIO ||
                exerciseEntity.getType() == ExerciseType.ROWER) {
            result += " km/h";
        }

        return result;
    }
}
