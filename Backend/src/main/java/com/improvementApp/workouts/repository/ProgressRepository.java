package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.ExercisesFields.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressRepository extends MongoRepository<Progress, String> {
}
