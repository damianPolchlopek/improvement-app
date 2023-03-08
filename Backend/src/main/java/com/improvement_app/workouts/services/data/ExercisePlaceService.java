package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Place;

import java.util.List;

public interface ExercisePlaceService {

    List<Place> getExercisePlaces();

    List<Place> saveAllExercisePlaces(List<Place> placeList);

    void deleteAllExercisePlaces();
}
