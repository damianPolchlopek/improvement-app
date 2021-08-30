package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {

}
