package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StrengthExercise implements ExerciseStrategy {

    private final String reps;
    private final String weight;

    public StrengthExercise(String reps, String weight) {
        this.reps = reps;
        this.weight = weight;
    }

    @Override
    public List<RepAndWeight> parseExercise() {
        validateRepsAndWeight(reps, weight);

        String[] repsArray = reps.split(String.valueOf(SERIES_DELIMITER));
        String[] weightArray = weight.split(String.valueOf(SERIES_DELIMITER));

        List<RepAndWeight> result = new ArrayList<>();

        for (int i = 0; i < repsArray.length; i++) {
            final String parsedRep = repsArray[i];
            final String parsedWeight = weightArray[i];
            final RepAndWeight singleRepAndWeight = new RepAndWeight(
                    Double.parseDouble(parsedRep),
                    Double.parseDouble(parsedWeight));

            result.add(singleRepAndWeight);
        }

        return result;
    }
}
