package com.improvement_app.workouts.services.data;

import com.improvement_app.workouts.entity2.enums.ExerciseProgress;
import com.improvement_app.workouts.response.ExerciseProgressResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@AllArgsConstructor
public class ExerciseProgressService {

    public List<ExerciseProgressResponse> getExerciseProgresses() {
        return Arrays.stream(ExerciseProgress.values()).map(place -> new ExerciseProgressResponse(place.getValue())).toList();
    }

}
