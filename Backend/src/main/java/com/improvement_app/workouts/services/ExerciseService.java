package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercises_fields.*;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseService {
    List<Exercise> findByDate(LocalDate date);

    List<Exercise> findByNameReverseSorted(String name);

    List<Exercise> findByName(String name);

    List<Exercise> findByTrainingName(String trainingName);

    void deleteByTrainingName(String trainingName);

    List<Exercise> saveAll(List<Exercise> newExercises);

    Exercise save(Exercise exercise);

    List<Exercise> findAll();

    void deleteById(String id);

    List<String> getAllTrainingNames();

    List<Name> getExerciseNames();

    List<Name> saveAllExerciseNames(List<Name> nameList);

    void deleteAllExerciseNames();

    List<Place> getExercisePlaces();

    List<Place> saveAllExercisePlaces(List<Place> placeList);

    void deleteAllExercisePlaces();

    List<Progress> getExerciseProgress();

    List<Progress> saveAllExerciseProgresses(List<Progress> progressList);

    void deleteAllExerciseProgresses();

    List<Type> getExerciseTypes();

    List<Type> saveAllExerciseTypes(List<Type> typeList);

    void deleteAllExerciseTypes();

    void deleteAllExercises();
}
