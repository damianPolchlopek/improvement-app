package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.helpers.ExercisesHelper;
import com.improvement_app.workouts.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;


    @Override
    public List<Exercise> findByDate(LocalDate date) {
        List<Exercise> exercises = exerciseRepository.findByDate(date);
        ExercisesHelper.sortExerciseListByIndex(exercises);
        return exercises;
    }

    @Override
    public List<Exercise> findByNameReverseSorted(String name) {
        List<Exercise> exercises = exerciseRepository.findByName(name);
        ExercisesHelper.sortExerciseListByDate(exercises);
        return exercises;
    }

    @Override
    public List<Exercise> findByName(String name) {
        List<Exercise> exercises = exerciseRepository.findByName(name);
        exercises.sort(Comparator.comparing(Exercise::getDate));
        return exercises;
    }

    @Override
    public List<Exercise> findByTrainingName(String trainingName) {
        List<Exercise> exercises = exerciseRepository.findByTrainingName(trainingName);
        ExercisesHelper.sortExerciseListByIndex(exercises);
        return exercises;
    }

    @Override
    public void deleteByTrainingName(String trainingName) {
        exerciseRepository.deleteByTrainingName(trainingName);
    }

    @Override
    public List<Exercise> saveAll(List<Exercise> exercises) {
        return exerciseRepository.saveAll(exercises);
    }

    @Override
    public List<Exercise> findAll() {
        List<Exercise> exercises = exerciseRepository.findAll();
        ExercisesHelper.sortExerciseListByDate(exercises);
        return exercises;
    }

    @Override
    public void deleteById(String id) {
        exerciseRepository.deleteById(id);
    }

    @Override
    public List<String> getAllTrainingNames() {
        List<Exercise> exercises = exerciseRepository.findAll();

        return exercises.stream()
                    .map(Exercise::getTrainingName)
                    .distinct()
                    .sorted(Collections.reverseOrder())
                    .collect(Collectors.toList());
    }

    @Override
    public void deleteAllExercises() {
        exerciseRepository.deleteAll();
    }

}
