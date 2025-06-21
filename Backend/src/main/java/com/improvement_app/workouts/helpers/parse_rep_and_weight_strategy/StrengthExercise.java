package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.ExerciseSetEntity;

import java.util.LinkedHashSet;
import java.util.Set;

public class StrengthExercise implements ExerciseStrategy {

    private final String reps;
    private final String weight;

    public StrengthExercise(String reps, String weight) {
        this.reps = reps;
        this.weight = weight;
    }

    @Override
    public Set<ExerciseSetEntity> parseExercise() {
        validateRepsAndWeight(reps, weight);

        String[] repsArray = reps.split(String.valueOf(SERIES_DELIMITER));
        String[] weightArray = weight.split(String.valueOf(SERIES_DELIMITER));

        final Set<ExerciseSetEntity> result = new LinkedHashSet<>();

        for (int i = 0; i < repsArray.length; i++) {
            final String parsedRep = repsArray[i];
            final String parsedWeight = weightArray[i];
            final ExerciseSetEntity singleRepAndWeight = new ExerciseSetEntity(
                    Double.parseDouble(parsedRep),
                    Double.parseDouble(parsedWeight));

            result.add(singleRepAndWeight);
        }

        return result;
    }
}
