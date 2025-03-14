package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.Exercise;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {

    List<Exercise> findByDateOrderByIndex(LocalDate date);

    List<Exercise> findByTrainingNameIn(List<String> trainingNames);

    List<Exercise> findByNameOrderByDate(String name, Sort sort);

    Optional<Exercise> findFirstByNameOrderByDateDesc(String name);

    List<Exercise> findByTrainingNameOrderByIndex(String trainingName);

    Exercise findTopByOrderByDateDesc();
}
