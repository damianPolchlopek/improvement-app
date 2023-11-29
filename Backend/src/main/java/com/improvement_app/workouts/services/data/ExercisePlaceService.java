package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.exercisesfields.Place;
import com.improvement_app.workouts.repository.PlaceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExercisePlaceService {

    private final PlaceRepository placeRepository;

    public List<Place> getExercisePlaces() {
        return placeRepository.findAll();
    }

    public List<Place> saveAllExercisePlaces(List<Place> placeList) {
        return placeRepository.saveAll(placeList);
    }

    public void deleteAllExercisePlaces() {
        placeRepository.deleteAll();
    }
}
