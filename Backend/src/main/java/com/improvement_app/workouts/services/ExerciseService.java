package com.improvement_app.workouts.services;

import com.improvement_app.workouts.entity.Exercise;
import com.improvement_app.workouts.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public Optional<List<Exercise>> findByDateOrderByIndex(LocalDate date) {
        List<Exercise> exercises = exerciseRepository.findByDateOrderByIndex(date);
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByNameReverseSorted(String name) {
        List<Exercise> exercises = exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.DESC, "date"));
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByNameOrderByDate(String name) {
        List<Exercise> exercises = exerciseRepository.findByNameOrderByDate(name, Sort.by(Sort.Direction.ASC, "date"));
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public Optional<List<Exercise>> findByTrainingNameOrderByIndex(String trainingName) {
        List<Exercise> exercises = exerciseRepository.findByTrainingNameOrderByIndex(trainingName);
        return !exercises.isEmpty() ? Optional.of(exercises) : Optional.empty();
    }

    public List<Exercise> saveAll(List<Exercise> exercises) {
        return exerciseRepository.saveAll(exercises);
    }

    public List<Exercise> findAllOrderByDateDesc() {
        return exerciseRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    public List<String> getAllTrainingNames() {
        List<Exercise> exercises = exerciseRepository.findAll();

        return exercises.stream()
                .map(Exercise::getTrainingName)
                .distinct()
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    public void deleteAllExercises() {
        exerciseRepository.deleteAll();
    }

    public List<Exercise> findAll() {
        return exerciseRepository.findAll();
    }

}
