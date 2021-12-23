package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.ExercisesFields.Type;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TypeRepository extends MongoRepository<Type, String> {
}
