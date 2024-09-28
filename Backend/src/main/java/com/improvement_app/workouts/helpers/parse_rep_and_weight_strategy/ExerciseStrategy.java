package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;

import java.util.List;

public interface ExerciseStrategy {
    char SERIES_DELIMITER = '/';
    List<RepAndWeight> parseExercise();

    default void validateRepsAndWeight(String weight, String reps) {
        long weightSeries = weight.chars()
                .filter(ch -> ch == SERIES_DELIMITER)
                .count();

        long repsSeries = reps.chars()
                .filter(ch -> ch == SERIES_DELIMITER)
                .count();

        if (weightSeries != repsSeries) {
            throw new TrainingRegexNotFoundException("Incorrect training data");
        }
    }
}
