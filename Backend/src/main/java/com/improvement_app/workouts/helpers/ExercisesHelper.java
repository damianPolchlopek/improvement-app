package com.improvement_app.workouts.helpers;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.ExerciseStrategy;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExercisesHelper {
    public static List<Exercise> filterExerciseList(List<Exercise> exercises) {
        return exercises
                .stream()
                .filter(e -> !e.getTrainingName().contains("Kopia"))
                .collect(Collectors.toList());
    }

    public static List<String> filterAndSortExerciseNameList(List<String> exercises) {
        return exercises
                .stream()
                .filter(e -> !e.contains("Kopia"))
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    public static List<Exercise> fillMissingFieldForExercise(List<Exercise> exercises, String trainingName) {
        List<Exercise> newExercises = new ArrayList<>();
        for (Exercise exercise : exercises) {

            final ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(
                    exercise.getType(), exercise.getReps(), exercise.getWeight());
            final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            newExercises.add(new Exercise(
                    exercise.getType(),
                    exercise.getPlace(),
                    exercise.getName(),
                    repAndWeightList,
                    exercise.getProgress(),
                    LocalDate.now(),
                    exercise.getReps(),
                    exercise.getWeight(),
                    trainingName,
                    exercise.getIndex()));
        }

        return newExercises;
    }

}
