package com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.exceptions.TrainingRegexNotFoundException;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@AllArgsConstructor
public class CardioExercise implements ExerciseStrategy {

    final String distance;
    final String speed;

    @Override
    public List<RepAndWeight> parseExercise() {
        final String distanceRegex  = "([0-9]+.?[0-9]*) km";
        final String speedRegex     = "([0-9]+.?[0-9]*) km/h";

        final String parsedDistance = parseString(distance, distanceRegex);
        final String parsedSpeed    = parseString(speed, speedRegex);

        RepAndWeight firstRep = new RepAndWeight(
                    Double.parseDouble(parsedDistance),
                    Double.parseDouble(parsedSpeed));

        final List<RepAndWeight> result = new ArrayList<>();
        result.add(firstRep);
        return result;
    }

    private String parseString(final String stringToParse, final String regex){
        Pattern pattern     = Pattern.compile(regex);
        Matcher matcher     = pattern.matcher(stringToParse);
        boolean matchFound  = matcher.find();

        if (!matchFound){
            throw new TrainingRegexNotFoundException("Incorrect string: " + stringToParse
                    + ", for following regex: " + regex);
        }

        return matcher.group(1);
    }

}
