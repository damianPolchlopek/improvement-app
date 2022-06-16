package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByDate(LocalDate date);

    List<Exercise> findByName(String name);

    List<Exercise> findByTrainingName(String trainingName);

    void deleteByTrainingName(String trainingName);

}
