package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.enums.ExercisePlace;
import com.improvement_app.workouts.response.ExercisePlaceResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class ExercisePlaceService {

    public List<ExercisePlaceResponse> getExercisePlaces() {
        return Arrays.stream(ExercisePlace.values())
                .map(place -> new ExercisePlaceResponse(place.getValue()))
                .toList();
    }
}
