package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.exercisesfields.Name;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NameRepository extends MongoRepository<Name, String> {
}
