package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.entity.exercises_fields.Name;
import com.improvement_app.workouts.entity.exercises_fields.Place;
import com.improvement_app.workouts.entity.exercises_fields.Progress;
import com.improvement_app.workouts.entity.exercises_fields.Type;
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
    private final NameRepository nameRepository;
    private final PlaceRepository placeRepository;
    private final ProgressRepository progressRepository;
    private final TypeRepository typeRepository;

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
    public Exercise save(Exercise exercise) {
        return exerciseRepository.save(exercise);
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
    public List<Name> getExerciseNames() {
        return nameRepository.findAll();
    }

    @Override
    public List<Name> saveAllExerciseNames(List<Name> nameList) {
        return nameRepository.saveAll(nameList);
    }

    @Override
    public void deleteAllExerciseNames() {
        nameRepository.deleteAll();
    }

    @Override
    public List<Place> getExercisePlaces() {
        return placeRepository.findAll();
    }

    @Override
    public List<Place> saveAllExercisePlaces(List<Place> placeList) {
        return placeRepository.saveAll(placeList);
    }

    @Override
    public void deleteAllExercisePlaces() {
        placeRepository.deleteAll();
    }

    @Override
    public List<Progress> getExerciseProgress() {
        return progressRepository.findAll();
    }

    @Override
    public List<Progress> saveAllExerciseProgresses(List<Progress> progressList) {
        return progressRepository.saveAll(progressList);
    }

    @Override
    public void deleteAllExerciseProgresses() {
        progressRepository.deleteAll();
    }

    @Override
    public List<Type> getExerciseTypes() {
        List<Type> types = typeRepository.findAll();
        types.sort(Comparator.comparing(Type::getType).reversed());
        return types;
    }

    @Override
    public List<Type> saveAllExerciseTypes(List<Type> typeList) {
        return typeRepository.saveAll(typeList);
    }

    @Override
    public void deleteAllExerciseTypes() {
        typeRepository.deleteAll();
    }

    @Override
    public void deleteAllExercises() {
        exerciseRepository.deleteAll();
    }

}
