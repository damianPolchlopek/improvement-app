package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;

import java.util.List;

public interface ExerciseStrategy {
    char SERIES_DELIMITER = '/';

    List<ExerciseSetEntity> parseExercise();

    default void validateRepsAndWeight(String weight, String reps) {
        long weightSeries = weight.chars()
                .filter(ch -> ch == SERIES_DELIMITER)
                .count();

        long repsSeries = reps.chars()
                .filter(ch -> ch == SERIES_DELIMITER)
                .count();

        if (weightSeries != repsSeries) {
            String msg = String.format("Different reps and weight series. Reps: %s,  Weight: %s, " +
                    "Reps series: %d, Weight series: %d", reps, weight, repsSeries, weightSeries);
            throw new TrainingRegexNotFoundException(msg);
        }
    }
}
