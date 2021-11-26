package com.improvementApp.workouts.services;

import com.improvementApp.workouts.entity.Exercise;
import com.improvementApp.workouts.entity.TrainingNameList;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseService {
    List<Exercise> findByDate(LocalDate date);

    List<Exercise> findByName(String name);

    List<Exercise> findByTrainingName(String trainingName);

    List<Exercise> saveAll(List<Exercise> newExercises);

    Exercise save(Exercise exercise);

    List<Exercise> findAll();

    void deleteById(String id);

    List<String> getAllTrainingNames();
}
