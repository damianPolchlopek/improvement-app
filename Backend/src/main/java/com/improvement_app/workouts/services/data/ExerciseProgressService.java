package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.enums.ExerciseProgress;
import com.improvement_app.workouts.response.ExerciseMetadataResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseProgressService {

    public List<ExerciseMetadataResponse> getExerciseProgresses() {
        return Arrays.stream(ExerciseProgress.values())
                .map(place -> new ExerciseMetadataResponse(place.getValue()))
                .toList();
    }

}
