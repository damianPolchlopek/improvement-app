package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity2.ExerciseSetEntity;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class SwimmingPoolExercise implements ExerciseStrategy {

    private final String distance;
    private final String laps;

    @Override
    public List<ExerciseSetEntity> parseExercise() {
        return List.of(new ExerciseSetEntity(
                Double.parseDouble(laps),
                Double.parseDouble(distance)));
    }
}
