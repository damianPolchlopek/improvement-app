package com.improvementApp.workouts.repository;

import com.improvementApp.workouts.entity.ExercisesFields.Place;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlaceRepository extends MongoRepository<Place, String> {
}
