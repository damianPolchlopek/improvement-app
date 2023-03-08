package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseService {
    List<Exercise> findByDate(LocalDate date);

    List<Exercise> findByNameReverseSorted(String name);

    List<Exercise> findByName(String name);

    List<Exercise> findByTrainingName(String trainingName);

    void deleteByTrainingName(String trainingName);

    List<Exercise> saveAll(List<Exercise> newExercises);

    List<Exercise> findAll();

    void deleteById(String id);

    List<String> getAllTrainingNames();

    void deleteAllExercises();
}
