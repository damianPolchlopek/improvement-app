package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.exercisesfields.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressRepository extends MongoRepository<Progress, String> {
}
