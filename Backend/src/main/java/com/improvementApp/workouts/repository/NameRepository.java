package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.ExercisesFields.Name;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NameRepository extends MongoRepository<Name, String> {
}
