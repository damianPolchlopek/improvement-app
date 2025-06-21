package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.ExerciseSetEntity;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;
import lombok.AllArgsConstructor;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@AllArgsConstructor
public class CardioExercise implements ExerciseStrategy {

    final String distance;
    final String speed;

    @Override
    public Set<ExerciseSetEntity> parseExercise() {
        final String distanceRegex = "([0-9]+.?[0-9]*) km";
        final String speedRegex = "([0-9]+.?[0-9]*) km/h";

        final String parsedDistance = parseString(distance, distanceRegex);
        final String parsedSpeed = parseString(speed, speedRegex);

        ExerciseSetEntity firstRep = new ExerciseSetEntity(
                Double.parseDouble(parsedDistance),
                Double.parseDouble(parsedSpeed));

        final Set<ExerciseSetEntity> result = new LinkedHashSet<>();
        result.add(firstRep);
        return result;
    }

    private String parseString(final String stringToParse, final String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(stringToParse);
        boolean matchFound = matcher.find();

        if (!matchFound) {
            throw new TrainingRegexNotFoundException("Incorrect string: " + stringToParse
                    + ", for following regex: " + regex);
        }

        return matcher.group(1);
    }

}
