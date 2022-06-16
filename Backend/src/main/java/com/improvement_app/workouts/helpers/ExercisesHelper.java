package com.improvement_app.workouts.helpers;

import com.improvement_app.workouts.entity.dto.RepAndWeight;
import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.helpers.parse_rep_and_weight_strategy.ExerciseStrategy;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExercisesHelper {
    public static List<Exercise> filterExerciseList(List<Exercise> exercises){
        return exercises
                .stream()
                .filter(e -> !e.getTrainingName().contains("Kopia"))
                .collect(Collectors.toList());
    }

    public static List<String> filterAndSortExerciseNameList(List<String> exercises){
        return exercises
                .stream()
                .filter(e -> !e.contains("Kopia"))
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    public static void sortExerciseListByDate(List<Exercise> exercises){
        exercises.sort((e1, e2) -> {
            boolean res =  e1.getDate().isBefore(e2.getDate());
            return res ? 1 : -1;
//            if(e1.getDate().isBefore(e1.getDate()) ){
//                return 1;
//            } else if (e1.getDate().isAfter(e1.getDate())){
//                return -1;
//            } else {
//                return 0;
//            }
        });
    }

    public static void sortExerciseListByIndex(List<Exercise> exercises) {
        exercises.sort(Comparator.comparingInt(Exercise::getIndex));
    }

    public static List<Exercise> updateExercises(List<Exercise> exercises, String trainingName){
        List<Exercise> newExercises = new ArrayList<>();
        for (Exercise exercise: exercises) {

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
