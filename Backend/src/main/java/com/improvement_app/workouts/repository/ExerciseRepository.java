package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByDate(LocalDate date);

    List<Exercise> findByDateOrderByIndex(LocalDate date);

    List<Exercise> findByNameOrderByDate(String name);

    List<Exercise> findByNameOrderByDateDesc(String name);

    List<Exercise> findByTrainingNameOrderByIndex(String trainingName);

    List<Exercise> findAllByOrderByDateDesc();

    void deleteByTrainingName(String trainingName);

}
