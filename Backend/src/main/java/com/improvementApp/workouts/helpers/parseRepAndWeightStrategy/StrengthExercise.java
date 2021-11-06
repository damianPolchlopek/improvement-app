package com.improvementApp.workouts.helpers.parseRepAndWeightStrategy;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;

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
        final Matcher repsMatcher   = parseString(reps);
        final Matcher weightMatcher = parseString(weight);

        List<RepAndWeight> result = new ArrayList<>();
        final int REPS_AMOUNT = 5;
        for (int i = 1; i < REPS_AMOUNT + 1; i++) {
            final String parsedRep      = repsMatcher.group(i);
            final String parsedWeight   = weightMatcher.group(i);
            final RepAndWeight singleRepAndWeight = new RepAndWeight(
                    Double.parseDouble(parsedRep),
                    Double.parseDouble(parsedWeight));

            result.add(singleRepAndWeight);
        }

        return result;
    }

    private Matcher parseString(final String stringToParse){
        final String regex = "(-?[0-9.?[0-9]*]+)/" +
                             "(-?[0-9.?[0-9]*]+)/" +
                             "(-?[0-9.?[0-9]*]+)/" +
                             "(-?[0-9.?[0-9]*]+)/" +
                             "(-?[0-9.?[0-9]*]+)";
        final Pattern pattern       = Pattern.compile(regex);
        final Matcher matcher       = pattern.matcher(stringToParse);
        final boolean isMatchFound  = matcher.find();

        if (!isMatchFound){
            throw new RuntimeException("Incorrect string: " + stringToParse
                    + ", for following regex: " + regex);
        }

        return matcher;
    }
}
