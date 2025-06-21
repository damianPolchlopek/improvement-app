package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity.enums.ExerciseType;
import com.improvement_app.workouts.response.ExerciseMetadataResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseTypeService {

    public List<ExerciseMetadataResponse> getExerciseTypes() {
        return Arrays.stream(ExerciseType.values()).map(place -> new ExerciseMetadataResponse(place.getValue())).toList();
    }
}
