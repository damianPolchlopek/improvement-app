package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import java.util.List;

public interface ExerciseStrategy {
    String SINGLE_EXERCISE_REGEX = "(-?[0-9.?[0-9]*]+)/?";
    List<RepAndWeight> parseExercise();
}
