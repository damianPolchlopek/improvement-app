package com.improvement_app.workouts.request;

import jakarta.validation.constraints.NotEmpty;


public record AddExerciseRequest(
                                 String type,
                                 String place,
                                 String name,
                                 String progress,
                                 @NotEmpty String reps,
                                 @NotEmpty String weight,
                                 int index) {
}
