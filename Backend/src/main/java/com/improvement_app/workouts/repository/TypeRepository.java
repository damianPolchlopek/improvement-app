package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.exercisesfields.Type;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TypeRepository extends MongoRepository<Type, String> {
}
