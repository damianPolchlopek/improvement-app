package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.entity2.ExerciseSetEntity;

import java.util.ArrayList;
import java.util.List;

public class KettleExercise implements ExerciseStrategy {

    private final String reps;
    private final String weight;

    public KettleExercise(String reps, String weight) {
        this.reps = reps;
        this.weight = weight;
    }

    @Override
    public List<ExerciseSetEntity> parseExercise() {
        validateRepsAndWeight(reps, weight);

        String[] repsArray = reps.split(String.valueOf(SERIES_DELIMITER));
        String[] weightArray = weight.split(String.valueOf(SERIES_DELIMITER));

        List<ExerciseSetEntity> result = new ArrayList<>();

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
