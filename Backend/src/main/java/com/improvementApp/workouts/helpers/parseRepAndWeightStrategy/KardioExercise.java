package com.improvementApp.workouts.helpers.parseRepAndWeightStrategy;

import com.improvementApp.workouts.DTO.RepAndWeight;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class KardioExercise implements ExerciseStrategy {

    final String distance_regex = "([0-9]+.?[0-9]*) km";
    final String speed_regex    = "([0-9]+.?[0-9]*) km/h";
    final String distance;
    final String speed;

    public KardioExercise(String distance, String speed) {
        this.distance   = distance;
        this.speed      = speed;
    }

    @Override
    public List<RepAndWeight> parseExercise() {
        final String parsedDistance = parseString(distance, distance_regex);
        final String parsedSpeed    = parseString(speed, speed_regex);
        RepAndWeight firstRep       = new RepAndWeight(
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

        if (matchFound){
            return matcher.group(1);
        }
        else {
            throw new RuntimeException("Incorrect string: " + stringToParse + ", for following regex: " + regex);
        }
    }

}
