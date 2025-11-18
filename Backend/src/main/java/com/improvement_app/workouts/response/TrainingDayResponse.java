package com.improvement_app.workouts.response;

import com.improvement_app.workouts.converters.InstantToLocalDateConverter;
import com.improvement_app.workouts.entity.TrainingEntity;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

public record TrainingDayResponse(
        LocalDate date,
        Map<String, ExerciseResponse> exercises
) {

    public static TrainingDayResponse from(TrainingEntity training) {
        Map<String, ExerciseResponse> exerciseMap = training.getExercises().stream()
                .collect(Collectors.toMap(
                        e -> e.getName().getValue(),
                        ExerciseResponse::new,
                        (existing, duplicate) -> existing,
                        LinkedHashMap::new
                ));

        LocalDate date = InstantToLocalDateConverter.convert(training.getDate());
        return new TrainingDayResponse(date, exerciseMap);
    }
}
