package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class SwimmingPoolExercise implements ExerciseStrategy {

    private final String distance;
    private final String laps;

    @Override
    public List<RepAndWeight> parseExercise() {
        return List.of(new RepAndWeight(
                Double.parseDouble(laps),
                Double.parseDouble(distance)));
    }
}
