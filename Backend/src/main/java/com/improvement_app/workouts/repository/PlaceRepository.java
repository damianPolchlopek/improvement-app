package com.improvement_app.workouts.repository;

import com.improvement_app.workouts.entity.exercisesfields.Place;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlaceRepository extends MongoRepository<Place, String> {
}
