package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.Exercise;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {

    List<Exercise> findByDateOrderByIndex(LocalDate date);

    List<Exercise> findByNameOrderByDate(String name, Sort sort);

    List<Exercise> findByTrainingNameOrderByIndex(String trainingName);

}
