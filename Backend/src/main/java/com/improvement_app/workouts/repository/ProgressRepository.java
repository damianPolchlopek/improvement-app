package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.exercises_fields.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressRepository extends MongoRepository<Progress, String> {
}
