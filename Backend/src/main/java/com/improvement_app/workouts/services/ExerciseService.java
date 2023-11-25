package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseService {
    List<Exercise> findByDateOrderByIndex(LocalDate date);

    List<Exercise> findByNameReverseSorted(String name);

    List<Exercise> findByNameOrderByDate(String name);

    List<Exercise> findByTrainingNameOrderByIndex(String trainingName);

    List<Exercise> saveAll(List<Exercise> newExercises);

    List<Exercise> findAllOrderByDateDesc();

    List<String> getAllTrainingNames();

    void deleteAllExercises();

    List<Exercise> findAll();
}
