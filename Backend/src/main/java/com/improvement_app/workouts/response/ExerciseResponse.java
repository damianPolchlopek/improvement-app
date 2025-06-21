package com.improvement_app.workouts.response;

import com.improvement_app.workouts.entity.ExerciseEntity;
import com.improvement_app.workouts.entity.ExerciseSetEntity;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public record ExerciseResponse(
        Long id,
        String name,
        String type,
        String progress,
        String trainingName,
        LocalDate date,
        String weight,
        String reps
) {
    public ExerciseResponse(ExerciseEntity entity) {
        this(
                entity.getId(),
                entity.getName().getValue(),
                entity.getType().getValue(),
                entity.getProgress().getValue(),
                entity.getTraining().getName(),
                entity.getTraining().getDate(),
                formatWeightsToString(entity.getExerciseSets()),
                formatRepsToString(entity.getExerciseSets())
        );
    }

    public ExerciseResponse(String exerciseName) {
        this(
                null,
                exerciseName,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }

    private static String formatRepsToString(Set<ExerciseSetEntity> sets) {
        return sets.stream()
                .map(set -> formatDouble(set.getRep()))
                .collect(Collectors.joining("/"));
    }

    private static String formatDouble(Double value) {
        return value % 1 == 0 ? String.valueOf(value.intValue()) : String.valueOf(value);
    }

    private static String formatWeightsToString(Set<ExerciseSetEntity> sets) {
        return sets.stream()
                .map(set -> formatDouble(set.getWeight()))
                .collect(Collectors.joining("/"));
    }
}
