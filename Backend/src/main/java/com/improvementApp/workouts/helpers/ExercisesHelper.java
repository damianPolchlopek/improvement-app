package com.improvementApp.workouts.helpers;

import com.improvementApp.workouts.entity.DTO.RepAndWeight;
import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.helpers.parseRepAndWeightStrategy.ExerciseStrategy;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ExercisesHelper {
    public static List<Exercise> filterExerciseList(List<Exercise> exercises){
        return exercises
                .stream()
                .filter(e -> !e.getTrainingName().contains("Kopia"))
//                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    public static void sortExerciseListByDate(List<Exercise> exercises){
        exercises.sort((e1, e2) -> {
            boolean res =  e1.getDate().isBefore(e2.getDate());
            return res ? 1 : -1;
        });
    }

    public static List<Exercise> updateExercises(List<Exercise> exercises){
        List<Exercise> newExercises = new ArrayList<>();
        for (Exercise exercise: exercises) {
            final ExerciseStrategy exerciseStrategy = DriveFilesHelper.getExerciseParseStrategy(
                        exercise.getExerciseType(), exercise.getReps(), exercise.getWeight());
            final List<RepAndWeight> repAndWeightList = exerciseStrategy.parseExercise();

            newExercises.add(new Exercise(
                    exercise.getExerciseType(),
                    exercise.getExercisePlace(),
                    exercise.getName(),
                    repAndWeightList,
                    exercise.getProgress(),
                    LocalDate.now(),
                    exercise.getReps(),
                    exercise.getWeight(),
                    exercise.getTrainingName()));
        }

        return newExercises;
    }
}
