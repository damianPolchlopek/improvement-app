package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.ExerciseSetEntity;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@RequiredArgsConstructor
public class SwimmingPoolExercise implements ExerciseStrategy {

    private final String distance;
    private final String laps;

    @Override
    public Set<ExerciseSetEntity> parseExercise() {
        return Set.of(new ExerciseSetEntity(
                Double.parseDouble(laps),
                Double.parseDouble(distance)));
    }
}
